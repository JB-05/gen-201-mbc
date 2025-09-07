'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { initializePayment, createRazorpayInstance, verifyPayment } from '@/lib/services/payment';
import { TermsModal } from './TermsModal';
import { checkTeamNameAvailability, registerTeam } from '@/lib/services/registration';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/custom-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { RegistrationFormData } from '@/types/registration';

// Validation Schema
const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  grade: z.enum(['11', '12']),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  email: z.string().regex(emailRegex, 'Invalid email address'),
  foodPreference: z.enum(['veg', 'non-veg', 'none']).optional(),
});

const teacherVerificationSchema = z.object({
  salutation: z.enum(['sir', 'maam'], {
    required_error: 'Please select a salutation',
  }),
  name: z.string().min(2, 'Teacher name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
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

  const handlePayment = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // Initialize payment
      const { success, orderId, error } = await initializePayment({
        teamName: data.teamName,
        email: data.teamLead.email,
        phone: data.teamLead.phone,
      });

      if (!success || !orderId) {
        throw new Error(error || 'Failed to initialize payment');
      }

      // Create Razorpay instance
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
              toast.success('Registration successful! Check your email for confirmation.');
              reset();
              setCurrentStep(1);
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
          toast.error(error.message || 'Payment failed. Please try again.');
          setIsSubmitting(false);
        }
      );

      // Open Razorpay payment form
      razorpay.open();
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
          <RadioGroup
            {...register(isTeamLead ? 'teamLead.gender' : `teamMembers.${index}.gender`)}
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
        </div>

        <div>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <Checkbox
                {...register(isTeamLead ? 'teamLead.grade' : `teamMembers.${index}.grade`)}
                value="11"
              />
              <span>Grade 11</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox
                {...register(isTeamLead ? 'teamLead.grade' : `teamMembers.${index}.grade`)}
                value="12"
              />
              <span>Grade 12</span>
            </label>
          </div>
        </div>

        <div>
          <CustomInput
            {...register(isTeamLead ? 'teamLead.phone' : `teamMembers.${index}.phone`)}
            placeholder="WhatsApp Number"
            type="tel"
            pattern="[0-9]{10}"
            className="bg-black/50 border-[#7303c0] text-white"
            autoComplete="tel"
          />
        </div>

        <div>
          <CustomInput
            {...register(isTeamLead ? 'teamLead.email' : `teamMembers.${index}.email`)}
            placeholder="Email Address"
            type="email"
            className="bg-black/50 border-[#7303c0] text-white"
            autoComplete="email"
          />
        </div>

        <div>
          <RadioGroup
            {...register(isTeamLead ? 'teamLead.foodPreference' : `teamMembers.${index}.foodPreference`)}
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
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl mx-auto space-y-8 p-4">
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
              <RadioGroup
                {...register('teacherVerification.salutation')}
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
                pattern="[0-9]{10}"
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
            type="button"
            disabled={isSubmitting || !watch('projectDetails.termsAccepted')}
            onClick={handleSubmit(handlePayment)}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white flex items-center space-x-2"
          >
            <span>{isSubmitting ? 'Processing...' : 'Pay & Register'}</span>
            <span className="text-sm">₹50</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
