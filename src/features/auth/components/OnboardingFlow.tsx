/**
 * OnboardingFlow Component - 3-step onboarding after registration
 * Step 1: Basic Info (form - required)
 * Step 2: Qualifications (cards with modal - skippable)
 * Step 3: Career Jobs (cards with modal - skippable)
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, Input, Select } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import {
  OnboardingProgressStepper,
  type OnboardingStep,
} from "./OnboardingProgressStepper";
import { OnboardingDataModal } from "./OnboardingDataModal";
import { QualificationCard } from "./QualificationCard";
import { OnboardingImageCollage } from "./OnboardingImageCollage";

// Basic info form schema
const basicInfoSchema = z.object({
  nationalId: z
    .string()
    .min(1, "رقم الهوية مطلوب")
    .regex(/^\d{10,14}$/, "رقم الهوية يجب أن يكون بين 10-14 رقم"),
  address: z.string().min(1, "المنشأ مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

// Qualification type for local state
interface QualificationData {
  id: string;
  degree: string;
  institution: string;
  specialization: string;
  graduationYear: string;
}

// Career job type for local state
interface CareerJobData {
  id: string;
  school: string;
  position: string;
  rank: string;
  stage: string;
  startYear: number;
  endYear: number | null;
  isCurrent: boolean;
}

// Qualification form schema
const qualificationSchema = z.object({
  degree: z.string().min(1, "الدرجة العلمية مطلوبة"),
  institution: z.string().min(1, "المؤسسة/الجامعة مطلوبة"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  graduationYear: z.string().min(1, "سنة التخرج مطلوبة"),
});

type QualificationFormData = z.infer<typeof qualificationSchema>;

// Career job form schema
const careerJobSchema = z.object({
  school: z.string().min(1, "اسم المدرسة مطلوب"),
  position: z.string().min(1, "المسمى الوظيفي مطلوب"),
  rank: z.string().min(1, "الدرجة الوظيفية مطلوبة"),
  stage: z.string().min(1, "المرحلة التعليمية مطلوبة"),
  startYear: z.string().min(1, "سنة البداية مطلوبة"),
  endYear: z.string().optional(),
  isCurrent: z.boolean(),
});

type CareerJobFormData = z.infer<typeof careerJobSchema>;

// Degree types
const DEGREE_TYPES = [
  { value: "دبلوم", label: "دبلوم" },
  { value: "بكالوريوس", label: "بكالوريوس" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
  { value: "دبلوم عالي", label: "دبلوم عالي" },
  { value: "شهادة مهنية", label: "شهادة مهنية" },
];

// Educational stages
const EDUCATIONAL_STAGES = [
  { value: "رياض الأطفال", label: "رياض الأطفال" },
  { value: "المرحلة الابتدائية", label: "المرحلة الابتدائية" },
  { value: "المرحلة المتوسطة", label: "المرحلة المتوسطة" },
  { value: "المرحلة الثانوية", label: "المرحلة الثانوية" },
  { value: "التعليم العالي", label: "التعليم العالي" },
];

// Generate years for dropdown
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

const YEARS = generateYears();

export function OnboardingFlow() {
  const router = useRouter();
  const { onboarding, buttons } = authContent;
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basicInfo");
  const [qualifications, setQualifications] = useState<QualificationData[]>([]);
  const [careerJobs, setCareerJobs] = useState<CareerJobData[]>([]);

  // Modal state
  const [isQualificationModalOpen, setIsQualificationModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [editingQualification, setEditingQualification] = useState<QualificationData | null>(null);
  const [editingCareerJob, setEditingCareerJob] = useState<CareerJobData | null>(null);

  // Basic info form
  const basicInfoForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      nationalId: "",
      address: "",
      birthDate: "",
      email: "",
      whatsapp: "",
    },
  });

  // Qualification form
  const qualificationForm = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      specialization: "",
      graduationYear: "",
    },
  });

  // Career job form
  const careerJobForm = useForm<CareerJobFormData>({
    resolver: zodResolver(careerJobSchema),
    defaultValues: {
      school: "",
      position: "",
      rank: "",
      stage: "",
      startYear: "",
      endYear: "",
      isCurrent: false,
    },
  });

  const isCurrent = careerJobForm.watch("isCurrent");

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Handle basic info submit
  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    // TODO: Save to backend
    console.log("Basic info:", data);
    setCurrentStep("qualifications");
  };

  // Handle add/edit qualification
  const handleQualificationSubmit = (data: QualificationFormData) => {
    if (editingQualification) {
      setQualifications((prev) =>
        prev.map((q) =>
          q.id === editingQualification.id ? { ...q, ...data } : q
        )
      );
    } else {
      setQualifications((prev) => [...prev, { id: generateId(), ...data }]);
    }
    closeQualificationModal();
  };

  // Handle add/edit career job
  const handleCareerJobSubmit = (data: CareerJobFormData) => {
    const jobData: CareerJobData = {
      id: editingCareerJob?.id || generateId(),
      school: data.school,
      position: data.position,
      rank: data.rank,
      stage: data.stage,
      startYear: parseInt(data.startYear),
      endYear: data.isCurrent ? null : data.endYear ? parseInt(data.endYear) : null,
      isCurrent: data.isCurrent,
    };

    if (editingCareerJob) {
      setCareerJobs((prev) =>
        prev.map((j) => (j.id === editingCareerJob.id ? jobData : j))
      );
    } else {
      setCareerJobs((prev) => [...prev, jobData]);
    }
    closeCareerModal();
  };

  // Modal handlers for qualifications
  const openAddQualificationModal = () => {
    setEditingQualification(null);
    qualificationForm.reset();
    setIsQualificationModalOpen(true);
  };

  const openEditQualificationModal = (qualification: QualificationData) => {
    setEditingQualification(qualification);
    qualificationForm.reset({
      degree: qualification.degree,
      institution: qualification.institution,
      specialization: qualification.specialization,
      graduationYear: qualification.graduationYear,
    });
    setIsQualificationModalOpen(true);
  };

  const closeQualificationModal = () => {
    setIsQualificationModalOpen(false);
    setEditingQualification(null);
    qualificationForm.reset();
  };

  const deleteQualification = (id: string) => {
    setQualifications((prev) => prev.filter((q) => q.id !== id));
  };

  // Modal handlers for career jobs
  const openAddCareerModal = () => {
    setEditingCareerJob(null);
    careerJobForm.reset();
    setIsCareerModalOpen(true);
  };

  const openEditCareerModal = (job: CareerJobData) => {
    setEditingCareerJob(job);
    careerJobForm.reset({
      school: job.school,
      position: job.position,
      rank: job.rank,
      stage: job.stage,
      startYear: job.startYear.toString(),
      endYear: job.endYear?.toString() || "",
      isCurrent: job.isCurrent,
    });
    setIsCareerModalOpen(true);
  };

  const closeCareerModal = () => {
    setIsCareerModalOpen(false);
    setEditingCareerJob(null);
    careerJobForm.reset();
  };

  const deleteCareerJob = (id: string) => {
    setCareerJobs((prev) => prev.filter((j) => j.id !== id));
  };

  // Navigation
  const handleNext = () => {
    if (currentStep === "qualifications") {
      setCurrentStep("careerJobs");
    } else if (currentStep === "careerJobs") {
      // TODO: Save to backend and navigate
      router.push(ROUTES.DASHBOARD);
    }
  };

  const handleSkip = () => {
    if (currentStep === "qualifications") {
      setCurrentStep("careerJobs");
    } else if (currentStep === "careerJobs") {
      router.push(ROUTES.DASHBOARD);
    }
  };

  // Get section title based on current step
  const getSectionTitle = () => {
    switch (currentStep) {
      case "basicInfo":
        return onboarding.basicInfo.title;
      case "qualifications":
        return onboarding.qualifications.title;
      case "careerJobs":
        return onboarding.careerJobs.title;
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)]">
      {/* Left Side - Image Collage (1/3 width, hidden on mobile) */}
      <div className="hidden lg:block w-1/3 p-4">
        <OnboardingImageCollage />
      </div>

      {/* Right Side - Content + Stepper (2/3 width) */}
      <div className="flex-1 lg:w-2/3 flex">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col px-4 lg:px-8">
          {/* Section Title */}
          <h2 className="text-2xl font-medium text-text-dark text-right mb-6">
            {getSectionTitle()}
          </h2>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Step 1: Basic Info Form */}
            {currentStep === "basicInfo" && (
              <form
                onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)}
                className="space-y-6"
              >
                {/* General Info Section */}
                <div>
                  <h3 className="text-lg font-medium text-primary-500 mb-4 text-right">
                    {onboarding.basicInfo.generalInfo}
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label={onboarding.basicInfo.nationalIdLabel}
                      placeholder={onboarding.basicInfo.nationalIdPlaceholder}
                      error={basicInfoForm.formState.errors.nationalId?.message}
                      {...basicInfoForm.register("nationalId")}
                    />
                    <Input
                      label={onboarding.basicInfo.addressLabel}
                      placeholder={onboarding.basicInfo.addressPlaceholder}
                      error={basicInfoForm.formState.errors.address?.message}
                      {...basicInfoForm.register("address")}
                    />
                    <Input
                      label={onboarding.basicInfo.birthDateLabel}
                      placeholder={onboarding.basicInfo.birthDatePlaceholder}
                      type="date"
                      dir="ltr"
                      className="text-left"
                      error={basicInfoForm.formState.errors.birthDate?.message}
                      {...basicInfoForm.register("birthDate")}
                    />
                  </div>
                </div>

                {/* Contact Info Section */}
                <div>
                  <h3 className="text-lg font-medium text-primary-500 mb-4 text-right">
                    {onboarding.basicInfo.contactInfo}
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label={onboarding.basicInfo.emailLabel}
                      placeholder={onboarding.basicInfo.emailPlaceholder}
                      type="email"
                      error={basicInfoForm.formState.errors.email?.message}
                      {...basicInfoForm.register("email")}
                    />
                    <Input
                      label={onboarding.basicInfo.whatsappLabel}
                      placeholder={onboarding.basicInfo.whatsappPlaceholder}
                      {...basicInfoForm.register("whatsapp")}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" className="w-full !rounded-full h-14">
                    {buttons.next}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Qualifications */}
            {currentStep === "qualifications" && (
              <div className="space-y-4">
                {qualifications.map((qual) => (
                  <QualificationCard
                    key={qual.id}
                    degree={qual.degree + " " + qual.specialization}
                    institution={qual.institution}
                    year={qual.graduationYear}
                    onEdit={() => openEditQualificationModal(qual)}
                    onDelete={() => deleteQualification(qual.id)}
                  />
                ))}

                <button
                  type="button"
                  onClick={openAddQualificationModal}
                  className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors justify-end w-full mt-4"
                >
                  <span className="font-medium">{onboarding.qualifications.addButton}</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Step 3: Career Jobs */}
            {currentStep === "careerJobs" && (
              <div className="space-y-4">
                {careerJobs.map((job) => (
                  <QualificationCard
                    key={job.id}
                    degree={job.position}
                    institution={job.school}
                    year={
                      job.isCurrent
                        ? `${job.startYear} - حتى الآن`
                        : `${job.startYear} - ${job.endYear}`
                    }
                    onEdit={() => openEditCareerModal(job)}
                    onDelete={() => deleteCareerJob(job.id)}
                  />
                ))}

                <button
                  type="button"
                  onClick={openAddCareerModal}
                  className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors justify-end w-full mt-4"
                >
                  <span className="font-medium">{onboarding.careerJobs.addButton}</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Buttons (only for steps 2 and 3) */}
          {currentStep !== "basicInfo" && (
            <div className="flex gap-4 pt-6 mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1 !rounded-full h-14"
              >
                {buttons.skip}
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 !rounded-full h-14"
              >
                {buttons.next}
              </Button>
            </div>
          )}
        </div>

        {/* Progress Stepper (Right side) */}
        <div className="hidden lg:flex w-48 shrink-0 justify-center pt-8">
          <OnboardingProgressStepper
            currentStep={currentStep}
            steps={onboarding.steps}
          />
        </div>
      </div>

      {/* Qualification Modal */}
      <OnboardingDataModal
        isOpen={isQualificationModalOpen}
        onClose={closeQualificationModal}
        title={onboarding.qualifications.modalTitle}
        submitLabel={onboarding.qualifications.saveButton}
        onSubmit={qualificationForm.handleSubmit(handleQualificationSubmit)}
      >
        <Select
          label={onboarding.qualifications.degreeLabel}
          placeholder="اختر الدرجة العلمية"
          options={DEGREE_TYPES}
          error={qualificationForm.formState.errors.degree?.message}
          {...qualificationForm.register("degree")}
        />
        <Input
          label={onboarding.qualifications.institutionLabel}
          placeholder="مثال: جامعة الملك فهد"
          error={qualificationForm.formState.errors.institution?.message}
          {...qualificationForm.register("institution")}
        />
        <Input
          label={onboarding.qualifications.titleLabel}
          placeholder="مثال: تربية لغة عربية"
          error={qualificationForm.formState.errors.specialization?.message}
          {...qualificationForm.register("specialization")}
        />
        <Select
          label={onboarding.qualifications.graduationDateLabel}
          placeholder="اختر السنة"
          options={YEARS}
          error={qualificationForm.formState.errors.graduationYear?.message}
          {...qualificationForm.register("graduationYear")}
        />
      </OnboardingDataModal>

      {/* Career Job Modal */}
      <OnboardingDataModal
        isOpen={isCareerModalOpen}
        onClose={closeCareerModal}
        title={onboarding.careerJobs.title}
        submitLabel={onboarding.qualifications.saveButton}
        onSubmit={careerJobForm.handleSubmit(handleCareerJobSubmit)}
      >
        <Input
          label={onboarding.careerJobs.schoolLabel}
          placeholder="اسم المدرسة"
          error={careerJobForm.formState.errors.school?.message}
          {...careerJobForm.register("school")}
        />
        <Input
          label={onboarding.careerJobs.positionLabel}
          placeholder="المسمى الوظيفي"
          error={careerJobForm.formState.errors.position?.message}
          {...careerJobForm.register("position")}
        />
        <Input
          label={onboarding.careerJobs.rankLabel}
          placeholder="الدرجة الوظيفية"
          error={careerJobForm.formState.errors.rank?.message}
          {...careerJobForm.register("rank")}
        />
        <Select
          label={onboarding.careerJobs.stageLabel}
          placeholder="اختر المرحلة التعليمية"
          options={EDUCATIONAL_STAGES}
          error={careerJobForm.formState.errors.stage?.message}
          {...careerJobForm.register("stage")}
        />
        <Select
          label={onboarding.careerJobs.startYearLabel}
          placeholder="سنة البداية"
          options={YEARS}
          error={careerJobForm.formState.errors.startYear?.message}
          {...careerJobForm.register("startYear")}
        />
        {!isCurrent && (
          <Select
            label={onboarding.careerJobs.endYearLabel}
            placeholder="سنة النهاية"
            options={YEARS}
            error={careerJobForm.formState.errors.endYear?.message}
            {...careerJobForm.register("endYear")}
          />
        )}
        <div className="flex items-center gap-2 justify-end">
          <label htmlFor="is-current" className="text-sm text-grey-600">
            {onboarding.careerJobs.currentJobLabel}
          </label>
          <input
            type="checkbox"
            id="is-current"
            {...careerJobForm.register("isCurrent")}
            className="w-4 h-4 text-primary-500 rounded border-grey-300 focus:ring-primary-500"
          />
        </div>
      </OnboardingDataModal>
    </div>
  );
}
