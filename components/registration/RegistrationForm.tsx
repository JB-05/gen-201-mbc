'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const registrationSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  school: z.string().min(3, 'School name is required'),
  district: z.string().min(2, 'District is required'),
  teamLead: memberSchema,
  teamMembers: z.array(memberSchema)
    .min(1, 'At least one team member is required')
    .max(3, 'Maximum 3 additional team members allowed'),
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
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamMembers: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'teamMembers',
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // Temporarily log the form data instead of submitting to Supabase
      console.log('Form submitted with data:', data);

      // Show success message
      toast.success('Registration successful! Check your email for confirmation.');
      
      // Reset form
      reset();
      setCurrentStep(1);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-4">
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
            type="submit"
            disabled={isSubmitting}
            className="bg-[#7303c0] hover:bg-[#928dab] text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>
      </div>
    </form>
  );
}
