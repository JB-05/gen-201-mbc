'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { initializePayment, createRazorpayInstance, verifyPayment, loadRazorpayScript } from '@/lib/services/payment';
import { TermsModal } from './TermsModal';
import { registerTeam } from '@/lib/services/registration';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { RegistrationFormData } from '@/types/registration';

// Validation Schema
const phoneRegex = /^[0-9]{10}$/;
const normalizePhone = (value: unknown) => {
  if (typeof value !== 'string') return value as any;
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length > 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  grade: z.enum(['11', '12']),
  phone: z.preprocess(normalizePhone, z.string().regex(phoneRegex, 'Invalid phone number')),
  email: z.string().regex(emailRegex, 'Invalid email address'),
  foodPreference: z.enum(['veg', 'non-veg', 'none']).optional(),
});

const teacherVerificationSchema = z.object({
  salutation: z.enum(['sir', 'maam'], {
    required_error: 'Please select a salutation',
  }),
  name: z.string().min(2, 'Teacher name must be at least 2 characters'),
  phone: z.preprocess(normalizePhone, z.string().regex(phoneRegex, 'Invalid phone number')),
});

const projectDetailsSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  projectField: z.string().min(2, 'Project field is required'),
  projectDescription: z.string().min(50, 'Project description must be at least 50 characters').max(500, 'Project description cannot exceed 500 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const registrationSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  school: z.string().min(3, 'School name is required'),
  district: z.string().min(2, 'District is required'),
  teamLead: memberSchema,
  teamMembers: z.array(memberSchema)
    .min(1, 'At least one team member is required')
    .max(3, 'Maximum 3 additional team members allowed'),
  teacherVerification: teacherVerificationSchema,
  projectDetails: projectDetailsSchema,
});

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isLoadingRazorpay, setIsLoadingRazorpay] = useState(false);

  useEffect(() => {
    const loadRazorpaySDK = async () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
        return;
      }

      setIsLoadingRazorpay(true);
      try {
        await loadRazorpayScript();
        setIsRazorpayLoaded(true);
      } catch (error) {
        console.error('Failed to load Razorpay SDK:', error);
        toast.error('Failed to load payment system. Please refresh the page or try again later.');
      } finally {
        setIsLoadingRazorpay(false);
      }
    };

    if (currentStep === 4) {
      loadRazorpaySDK();
    }
  }, [currentStep]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamMembers: [{}],
      teacherVerification: {
        salutation: 'sir',
        name: '',
        phone: '',
      },
      projectDetails: {
        projectName: '',
        projectField: '',
        projectDescription: '',
        termsAccepted: false,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'teamMembers',
  });

  // Store form data for payment processing
  const [formDataForPayment, setFormDataForPayment] = useState<RegistrationFormData | null>(null);

  const handlePaymentInitiation = async (data: RegistrationFormData) => {
    if (!isRazorpayLoaded) {
      toast.error('Payment system is not ready. Please wait or refresh the page.');
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    try {
      setIsSubmitting(true);
      await handlePayment(data);
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      toast.error(error.message || 'Failed to start payment process. Please try again.');
    }
  };

  const handlePayment = async (data: RegistrationFormData) => {
    console.log('handlePayment called with data:', data);
    setIsSubmitting(true);
    
    // Check if Razorpay is configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error('Razorpay key not configured');
      toast.error('Payment system is not configured. Please contact support.');
      setIsSubmitting(false);
      return;
    }
    
    console.log('Razorpay key found, initializing payment...');
    
    try {
      // Initialize payment
      console.log('Calling initializePayment...');
      const { success, orderId, error } = await initializePayment({
        teamName: data.teamName,
        email: data.teamLead.email,
        phone: data.teamLead.phone,
      });

      if (!success || !orderId) {
        throw new Error(error || 'Failed to initialize payment');
      }

      // Create Razorpay instance
      console.log('Creating Razorpay instance with orderId:', orderId);
      const razorpay = createRazorpayInstance(
        orderId,
        {
          teamName: data.teamName,
          email: data.teamLead.email,
          phone: data.teamLead.phone,
        },
        async (response) => {
          // On successful payment
          try {
            // Verify payment
            const verificationResult = await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (!verificationResult.success) {
              throw new Error('Payment verification failed');
            }

            // Register team with payment details
            const registrationResult = await registerTeam(
              {
                team_name: data.teamName,
                school_name: data.school,
                school_district: data.district,
                lead_phone: data.teamLead.phone,
                lead_email: data.teamLead.email,
              },
              [
                { ...data.teamLead, is_team_lead: true },
                ...data.teamMembers,
              ],
              {
                project_name: data.projectDetails.projectName,
                project_field: data.projectDetails.projectField,
                project_description: data.projectDetails.projectDescription,
              },
              {
                salutation: data.teacherVerification.salutation,
                teacher_name: data.teacherVerification.name,
                teacher_phone: data.teacherVerification.phone,
              },
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }
            );

            if (registrationResult.success) {
              // Show success message with more details
              toast.success(
                `🎉 Registration successful! Team ID: ${registrationResult.teamId}. Check your email for confirmation.`,
                { duration: 6000 }
              );
              
              // Reset form and go back to first step
              reset();
              setCurrentStep(1);
              
              // Scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              throw new Error(registrationResult.error || 'Registration failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Registration failed. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          // On payment failure
          console.error('Payment failed:', error);
          let errorMessage = 'Payment failed. Please try again.';
          
          if (error.code === 'BAD_REQUEST_ERROR') {
            errorMessage = 'Invalid payment details. Please check your information.';
          } else if (error.code === 'GATEWAY_ERROR') {
            errorMessage = 'Payment gateway error. Please try again later.';
          } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else if (error.description) {
            errorMessage = error.description;
          }
          
          toast.error(errorMessage);
          setIsSubmitting(false);
        }
      );

      // Open Razorpay payment form
      console.log('Opening Razorpay payment gateway...');
      razorpay.open();
      console.log('Razorpay.open() called');
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const MemberForm = ({ isTeamLead = false, index = 0 }) => (
    <div className="space-y-4 p-6 bg-black/30 backdrop-blur-sm border border-[#7303c0] clip-polygon">
      <h3 className="font-orbitron text-xl text-[#928dab] mb-4">
        {isTeamLead ? 'Team Lead Details' : `Team Member ${index + 1}`}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <CustomInput
            {...register(isTeamLead ? 'teamLead.name' : `teamMembers.${index}.name`)}
            placeholder="Full Name"
            type="text"
            className="bg-black/50 border-[#7303c0] text-white"
            autoComplete="name"
          />
          {errors?.teamLead?.name && (
            <span className="text-red-500 text-sm">{errors.teamLead.name.message}</span>
          )}
        </div>

        <div>
          <Controller
            name={isTeamLead ? 'teamLead.gender' : `teamMembers.${index}.gender`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id={`gender-male-${index}`} />
                  <label htmlFor={`gender-male-${index}`}>Male</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id={`gender-female-${index}`} />
                  <label htmlFor={`gender-female-${index}`}>Female</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id={`gender-other-${index}`} />
                  <label htmlFor={`gender-other-${index}`}>Other</label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div>
          <Controller
            name={isTeamLead ? 'teamLead.grade' : `teamMembers.${index}.grade`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="11" id={`grade-11-${index}`} />
                  <label htmlFor={`grade-11-${index}`}>Grade 11</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12" id={`grade-12-${index}`} />
                  <label htmlFor={`grade-12-${index}`}>Grade 12</label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div>
          <CustomInput
            {...register(isTeamLead ? 'teamLead.phone' : `teamMembers.${index}.phone`)}
            placeholder="WhatsApp Number"
            type="tel"
            inputMode="numeric"
            className="bg-black/50 border-[#7303c0] text-white"
            autoComplete="tel"
          />
          {isTeamLead
            ? errors?.teamLead?.phone && (
                <span className="text-red-500 text-sm">{errors.teamLead.phone.message as string}</span>
              )
            : errors?.teamMembers?.[index]?.phone && (
                <span className="text-red-500 text-sm">{errors?.teamMembers?.[index]?.phone?.message as unknown as string}</span>
              )}
        </div>

        <div>
          <CustomInput
            {...register(isTeamLead ? 'teamLead.email' : `teamMembers.${index}.email`)}
            placeholder="Email Address"
            type="email"
            className="bg-black/50 border-[#7303c0] text-white"
            autoComplete="email"
          />
          {isTeamLead
            ? errors?.teamLead?.email && (
                <span className="text-red-500 text-sm">{errors.teamLead.email.message as string}</span>
              )
            : errors?.teamMembers?.[index]?.email && (
                <span className="text-red-500 text-sm">{errors?.teamMembers?.[index]?.email?.message as unknown as string}</span>
              )}
        </div>

        <div>
          <Controller
            name={isTeamLead ? 'teamLead.foodPreference' : `teamMembers.${index}.foodPreference`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="veg" id={`food-veg-${index}`} />
                  <label htmlFor={`food-veg-${index}`}>Vegetarian</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-veg" id={`food-nonveg-${index}`} />
                  <label htmlFor={`food-nonveg-${index}`}>Non-Vegetarian</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id={`food-none-${index}`} />
                  <label htmlFor={`food-none-${index}`}>No Food Required</label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(
      async (data) => {
        if (currentStep === 4) {
          await handlePaymentInitiation(data);
        } else {
          setCurrentStep(currentStep + 1);
        }
      },
      (errors) => {
        console.error('Form validation failed:', errors);
        toast.error('Please check the form for errors.');
      }
    )} noValidate className="max-w-4xl mx-auto space-y-8 p-4">
      <fieldset disabled={isSubmitting} className="space-y-8">
      {/* Step 1: Team Details */}
      <div className={`space-y-6 ${currentStep !== 1 && 'hidden'}`}>
        <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-6 clip-polygon">
          <h3 className="font-orbitron text-xl text-[#928dab] mb-4">Team Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              {...register('teamName')}
              placeholder="Team Name"
              type="text"
              className="bg-black/50 border-[#7303c0] text-white"
            />
            
            <CustomInput
              {...register('school')}
              placeholder="School Name"
              type="text"
              className="bg-black/50 border-[#7303c0] text-white"
            />
            
            <CustomInput
              {...register('district')}
              placeholder="District/Location of School"
              type="text"
              className="bg-black/50 border-[#7303c0] text-white"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="bg-[#7303c0] hover:bg-[#928dab] text-white"
        >
          Next: Team Lead Details
        </Button>
      </div>

      {/* Step 2: Team Lead */}
      <div className={`space-y-6 ${currentStep !== 2 && 'hidden'}`}>
        <MemberForm isTeamLead={true} />
        
        {/* Teacher Verification Section */}
        <div className="space-y-4 p-6 bg-black/30 backdrop-blur-sm border border-[#7303c0] clip-polygon">
          <h3 className="font-orbitron text-xl text-[#928dab] mb-4">
            Teacher Verification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Controller
                name={'teacherVerification.salutation'}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sir" id="salutation-sir" />
                      <label htmlFor="salutation-sir">Sir</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maam" id="salutation-maam" />
                      <label htmlFor="salutation-maam">Ma'am</label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors?.teacherVerification?.salutation && (
                <span className="text-red-500 text-sm">{errors.teacherVerification.salutation.message}</span>
              )}
            </div>

            <div>
              <CustomInput
                {...register('teacherVerification.name')}
                placeholder="Teacher's Name"
                type="text"
                className="bg-black/50 border-[#7303c0] text-white"
              />
              {errors?.teacherVerification?.name && (
                <span className="text-red-500 text-sm">{errors.teacherVerification.name.message}</span>
              )}
            </div>

            <div>
              <CustomInput
                {...register('teacherVerification.phone')}
                placeholder="Teacher's Phone Number"
                type="tel"
                inputMode="numeric"
                className="bg-black/50 border-[#7303c0] text-white"
              />
              {errors?.teacherVerification?.phone && (
                <span className="text-red-500 text-sm">{errors.teacherVerification.phone.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="bg-[#928dab] hover:bg-[#7303c0] text-white"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white"
          >
            Next: Team Members
          </Button>
        </div>
      </div>

      {/* Step 3: Team Members */}
      <div className={`space-y-6 ${currentStep !== 3 && 'hidden'}`}>
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <MemberForm index={index} />
            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        {fields.length < 3 && (
          <Button
            type="button"
            onClick={() => append({
              name: '',
              gender: 'male',
              grade: '11',
              phone: '',
              email: '',
              foodPreference: 'none'
            })}
            className="bg-[#928dab] hover:bg-[#7303c0] text-white"
          >
            Add Team Member
          </Button>
        )}

        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="bg-[#928dab] hover:bg-[#7303c0] text-white"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white"
          >
            Next: Project Details
          </Button>
        </div>
      </div>

      {/* Step 4: Project Details */}
      <div className={`space-y-6 ${currentStep !== 4 && 'hidden'}`}>
        <div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-6 clip-polygon">
          <h3 className="font-orbitron text-xl text-[#928dab] mb-4">Project Details</h3>
          
          <div className="space-y-4">
            <div>
              <CustomInput
                {...register('projectDetails.projectName')}
                placeholder="Project Name"
                type="text"
                className="bg-black/50 border-[#7303c0] text-white w-full"
              />
              {errors?.projectDetails?.projectName && (
                <span className="text-red-500 text-sm">{errors.projectDetails.projectName.message}</span>
              )}
            </div>

            <div>
              <select
                {...register('projectDetails.projectField')}
                className="w-full bg-black/50 border border-[#7303c0] text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7303c0]"
              >
                <option value="">Select Project Field</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Transportation">Transportation</option>
                <option value="Finance">Finance</option>
                <option value="Social Impact">Social Impact</option>
                <option value="Other">Other</option>
              </select>
              {errors?.projectDetails?.projectField && (
                <span className="text-red-500 text-sm">{errors.projectDetails.projectField.message}</span>
              )}
            </div>

            <div>
              <textarea
                {...register('projectDetails.projectDescription')}
                placeholder="Project Description (minimum 50 characters)"
                className="w-full h-32 bg-black/50 border border-[#7303c0] text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7303c0]"
              />
              {errors?.projectDetails?.projectDescription && (
                <span className="text-red-500 text-sm">{errors.projectDetails.projectDescription.message}</span>
              )}
              <div className="text-sm text-[#928dab] mt-1">
                Character count: {watch('projectDetails.projectDescription')?.length || 0}/500
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('projectDetails.termsAccepted')}
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-[#7303c0] bg-black/50 checked:bg-[#7303c0]"
                />
                <label htmlFor="terms" className="text-sm text-[#928dab]">
                  I agree to the <TermsModal /> and acknowledge that:
                  <ul className="mt-2 ml-4 space-y-1 list-disc">
                    <li>I am a student of Class 11 or 12</li>
                    <li>The registration fee of ₹50 is non-refundable</li>
                    <li>Payment does not guarantee selection for the offline hackathon</li>
                    <li>I am responsible for informing my team members about these terms</li>
                  </ul>
                </label>
              </div>
              {errors?.projectDetails?.termsAccepted?.message && (
                <span className="text-red-500 text-sm block mt-1">
                  {errors.projectDetails.termsAccepted.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="bg-[#928dab] hover:bg-[#7303c0] text-white"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !watch('projectDetails.termsAccepted') || isLoadingRazorpay || !isRazorpayLoaded}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white flex items-center space-x-2"
          >
            <span>
              {isLoadingRazorpay ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading Payment System...
                </div>
              ) : isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing Payment...
                </div>
              ) : !isRazorpayLoaded ? (
                'Payment System Not Ready'
              ) : (
                'Pay ₹50 & Register'
              )}
            </span>
          </Button>
        </div>
      </div>
      </fieldset>
          </form>
  );
}

