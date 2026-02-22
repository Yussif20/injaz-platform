/**
 * OnboardingFlow Component - 3-step onboarding after registration
 * Step 1: Basic Info (form - required)
 * Step 2: Qualifications (cards with modal - skippable)
 * Step 3: Career Jobs (cards with modal - skippable)
 */

"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, DatePicker, Input, Select } from "@/shared/components/ui";
import { authContent } from "@/content";
import { ROUTES } from "@/config";
import {
  OnboardingProgressStepper,
  type OnboardingStep,
} from "./OnboardingProgressStepper";
import { OnboardingDataModal } from "./OnboardingDataModal";
import { QualificationCard } from "./QualificationCard";
import { OnboardingImageCollage } from "./OnboardingImageCollage";
import Image from "next/image";

// Basic info form schema
const basicInfoSchema = z.object({
  nationalId: z
    .string()
    .min(1, "رقم الهوية مطلوب")
    .regex(/^\d{14}$/, "رقم الهوية يجب أن يكون 14 أرقام"),
  address: z.string().min(1, "المنشأ مطلوب"),
  birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
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

export interface OnboardingFlowHandle {
  handleBack: () => void;
}

export const OnboardingFlow = forwardRef<OnboardingFlowHandle>(
  function OnboardingFlow(_, ref) {
    const router = useRouter();
    const { onboarding, buttons } = authContent;
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("basicInfo");
    const [qualifications, setQualifications] = useState<QualificationData[]>(
      [],
    );
    const [careerJobs, setCareerJobs] = useState<CareerJobData[]>([]);

    // Modal state
    const [isQualificationModalOpen, setIsQualificationModalOpen] =
      useState(false);
    const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
    const [editingQualification, setEditingQualification] =
      useState<QualificationData | null>(null);
    const [editingCareerJob, setEditingCareerJob] =
      useState<CareerJobData | null>(null);
    const [showQualDeleteConfirm, setShowQualDeleteConfirm] = useState(false);
    const [qualToDelete, setQualToDelete] = useState<string | null>(null);
    const [showJobDeleteConfirm, setShowJobDeleteConfirm] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);
    const [showDeleteToast, setShowDeleteToast] = useState(false);

    // Basic info form
    const basicInfoForm = useForm<BasicInfoFormData>({
      resolver: zodResolver(basicInfoSchema),
      mode: "onChange",
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
            q.id === editingQualification.id ? { ...q, ...data } : q,
          ),
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
        rank: data.rank,
        stage: data.stage,
        startYear: parseInt(data.startYear),
        endYear: data.isCurrent
          ? null
          : data.endYear
            ? parseInt(data.endYear)
            : null,
        isCurrent: data.isCurrent,
      };

      if (editingCareerJob) {
        setCareerJobs((prev) =>
          prev.map((j) => (j.id === editingCareerJob.id ? jobData : j)),
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
      setQualToDelete(id);
      setShowQualDeleteConfirm(true);
    };

    const handleConfirmQualDelete = () => {
      if (qualToDelete) {
        setQualifications((prev) => prev.filter((q) => q.id !== qualToDelete));
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 3000);
        setShowQualDeleteConfirm(false);
        setQualToDelete(null);
      }
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
      setJobToDelete(id);
      setShowJobDeleteConfirm(true);
    };

    const handleConfirmJobDelete = () => {
      if (jobToDelete) {
        setCareerJobs((prev) => prev.filter((j) => j.id !== jobToDelete));
        setShowDeleteToast(true);
        setTimeout(() => setShowDeleteToast(false), 3000);
        setShowJobDeleteConfirm(false);
        setJobToDelete(null);
      }
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

    // Handle back navigation
    const handleBack = () => {
      if (currentStep === "basicInfo") {
        // Go back to signup page
        router.push(ROUTES.SIGN_UP);
      } else if (currentStep === "qualifications") {
        // Go back to basic info (data is preserved in state)
        setCurrentStep("basicInfo");
      } else if (currentStep === "careerJobs") {
        // Go back to qualifications (data is preserved in state)
        setCurrentStep("qualifications");
      }
    };

    // Expose handleBack to parent via ref
    useImperativeHandle(ref, () => ({
      handleBack,
    }));

    return (
      <div className="flex flex-col lg:flex-row h-full lg:min-h-[calc(100vh-120px)]">
        {/* Right Side - Content + Stepper (2/3 width) */}
        <div className="flex-1 lg:w-3/5 flex flex-col lg:min-h-[calc(100vh-120px)]">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col px-4 lg:px-8">
            {/* Mobile/Tablet Stepper - Full Width */}
            <div className="lg:hidden w-full mb-6">
              <OnboardingProgressStepper
                currentStep={currentStep}
                steps={onboarding.steps}
                direction="horizontal"
              />
            </div>

            {/* Content with Stepper Row */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-center">
              <div className="flex flex-row items-center">
                {/* Progress Stepper (Right side on desktop) - Fixed height */}
                <div className="hidden lg:flex w-48 shrink-0 justify-center h-105">
                  <OnboardingProgressStepper
                    currentStep={currentStep}
                    steps={onboarding.steps}
                  />
                </div>

                {/* Step Content */}
                <div className="flex-1 flex flex-col gap-4 md:gap-6 lg:gap-7">
                  {/* Step 1: Basic Info Form */}
                  {currentStep === "basicInfo" && (
                    <form
                      onSubmit={basicInfoForm.handleSubmit(
                        handleBasicInfoSubmit,
                      )}
                      className="flex flex-col gap-4 md:gap-6 lg:gap-7"
                    >
                      {/* Main Section Title */}
                      <h2 className="text-xl hidden lg:block md:text-2xl lg:text-3xl font-medium text-text-dark text-right">
                        {onboarding.basicInfo.title}
                      </h2>

                      {/* General Info Section */}
                      <div>
                        <h3 className="text-base md:text-xl lg:text-2xl font-normal text-primary-500 mb-3 text-right">
                          {onboarding.basicInfo.generalInfo}
                        </h3>
                        <div className="space-y-3">
                          <Input
                            label={onboarding.basicInfo.nationalIdLabel}
                            placeholder={
                              onboarding.basicInfo.nationalIdPlaceholder
                            }
                            error={
                              basicInfoForm.formState.errors.nationalId?.message
                            }
                            {...basicInfoForm.register("nationalId")}
                          />
                          <Input
                            label={onboarding.basicInfo.addressLabel}
                            placeholder={
                              onboarding.basicInfo.addressPlaceholder
                            }
                            error={
                              basicInfoForm.formState.errors.address?.message
                            }
                            {...basicInfoForm.register("address")}
                          />
                          <DatePicker
                            label={onboarding.basicInfo.birthDateLabel}
                            placeholder={
                              onboarding.basicInfo.birthDatePlaceholder
                            }
                            value={basicInfoForm.watch("birthDate")}
                            onChange={(val) =>
                              basicInfoForm.setValue("birthDate", val, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            error={
                              basicInfoForm.formState.errors.birthDate?.message
                            }
                          />
                          <Input
                            label={onboarding.basicInfo.emailLabel}
                            placeholder={onboarding.basicInfo.emailPlaceholder}
                            type="email"
                            error={
                              basicInfoForm.formState.errors.email?.message
                            }
                            {...basicInfoForm.register("email")}
                          />
                        </div>
                      </div>

                      {/* Contact Info Section */}
                      <div>
                        <h3 className="text-base md:text-xl lg:text-2xl font-normal text-primary-500 mb-3 text-right">
                          {onboarding.basicInfo.contactInfo}
                        </h3>
                        <div className="space-y-3">
                          <Input
                            label={onboarding.basicInfo.whatsappLabel}
                            placeholder={
                              onboarding.basicInfo.whatsappPlaceholder
                            }
                            {...basicInfoForm.register("whatsapp")}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-2">
                        <Button
                          type="submit"
                          disabled={!basicInfoForm.formState.isValid}
                          className="w-full rounded-full! h-14"
                        >
                          {buttons.next}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Step 2: Qualifications */}
                  {currentStep === "qualifications" && (
                    <div className="flex flex-col gap-4">
                      {/* Section Title */}
                      <h2 className="hidden lg:block text-xl md:text-2xl lg:text-3xl font-medium text-text-dark text-right">
                        {onboarding.qualifications.title}
                      </h2>

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
                          className="flex items-center gap-2 text-primary-500  justify-start w-full mt-4"
                        >
                          <Image
                            src="/images/auth/plus.svg"
                            alt="Add"
                            className="h-5 w-5 md:h-6 md:w-6"
                            width={20}
                            height={20}
                          />
                          <span className="font-light text-base md:text-lg">
                            {qualifications.length === 0
                              ? onboarding.qualifications.firstAddButton
                              : onboarding.qualifications.addButton}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Career Jobs */}
                  {currentStep === "careerJobs" && (
                    <div className="flex flex-col gap-4">
                      {/* Section Title */}
                      <h2 className="hidden lg:block text-xl md:text-2xl lg:text-3xl font-medium text-text-dark text-right">
                        {onboarding.careerJobs.title}
                      </h2>

                      <div className="space-y-4">
                        {careerJobs.map((job) => (
                          <QualificationCard
                            key={job.id}
                            degree={job.rank}
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
                          className="flex items-center gap-2 text-primary-500  justify-start w-full mt-4"
                        >
                          <Image
                            src="/images/auth/plus.svg"
                            alt="Add"
                            className="h-5 w-5 md:h-6 md:w-6"
                            width={20}
                            height={20}
                          />
                          <span className="font-light text-base md:text-lg">
                            {careerJobs.length === 0
                              ? onboarding.careerJobs.firstAddButton
                              : onboarding.careerJobs.addButton}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons (only for steps 2 and 3) */}
                  {currentStep !== "basicInfo" && (
                    <div className="mt-2">
                      <div className="flex gap-3 sm:gap-3 md:gap-4">
                        <button
                          type="button"
                          onClick={handleSkip}
                          className="flex-1 rounded-full h-10 sm:h-10 md:h-14 border-2 bg-white border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 font-light text-base lg:text-lg transition-colors duration-200"
                        >
                          {buttons.skip}
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 rounded-full h-10 sm:h-10 md:h-14 bg-primary-500 text-white hover:bg-primary-800 active:bg-primary-700 font-light text-base lg:text-lg transition-colors duration-200"
                        >
                          {buttons.next}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Image Collage */}
            <div className="lg:hidden mt-6">
              <OnboardingImageCollage />
            </div>
          </div>
        </div>

        {/* Left Side - Image Collage (1/3 width, hidden on mobile) */}
        <div className="hidden lg:block w-2/5 p-4">
          <OnboardingImageCollage />
        </div>

        {/* Qualification Modal */}
        <OnboardingDataModal
          isOpen={isQualificationModalOpen}
          onClose={closeQualificationModal}
          title={
            editingQualification
              ? onboarding.qualifications.modalEditTitle
              : onboarding.qualifications.modalTitle
          }
          submitLabel={
            editingQualification
              ? onboarding.qualifications.editButton
              : onboarding.qualifications.saveButton
          }
          onSubmit={qualificationForm.handleSubmit(handleQualificationSubmit)}
          isEditing={!!editingQualification}
          isFormValid={qualificationForm.formState.isValid}
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
          title={
            editingCareerJob
              ? onboarding.careerJobs.modalEditTitle
              : onboarding.careerJobs.modalTitle
          }
          submitLabel={
            editingCareerJob
              ? onboarding.careerJobs.editButton
              : onboarding.careerJobs.saveButton
          }
          onSubmit={careerJobForm.handleSubmit(handleCareerJobSubmit)}
          isEditing={!!editingCareerJob}
          isFormValid={careerJobForm.formState.isValid}
        >
          <Input
            label={onboarding.careerJobs.schoolLabel}
            placeholder="اسم المدرسة"
            error={careerJobForm.formState.errors.school?.message}
            {...careerJobForm.register("school")}
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

        {/* Delete Toast */}
        {showDeleteToast && (
          <div
            className="fixed bottom-4 right-4 px-6 py-3 rounded-[20px] shadow-lg z-50 w-full md:w-[660px] h-[54px] flex items-center gap-3"
            style={{ backgroundColor: "#f3d8da" }}
          >
            <Image
              src="/icons/ui/information-circle.svg"
              alt="info"
              width={20}
              height={20}
            />
            <p className="font-light" style={{ color: "#b1363e" }}>
              تم حذف البيانات
            </p>
          </div>
        )}

        {/* Delete Qualification Confirmation Modal */}
        {showQualDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      setShowQualDeleteConfirm(false);
                      setQualToDelete(null);
                    }}
                    className="p-1 hover:bg-grey-100 rounded-lg transition-colors"
                    aria-label="إغلاق"
                  >
                    <svg
                      className="w-5 h-5 text-grey-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <p className="text-grey-600 text-center flex-1">
                    هل انت متأكد من حذف البيانات؟
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmQualDelete}
                    className="flex-1 px-4 py-3 rounded-[20px] bg-warning-500 text-white hover:bg-warning-600 transition-colors"
                  >
                    حذف البيانات
                  </button>
                  <button
                    onClick={() => {
                      setShowQualDeleteConfirm(false);
                      setQualToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-[20px] border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Career Job Confirmation Modal */}
        {showJobDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => {
                      setShowJobDeleteConfirm(false);
                      setJobToDelete(null);
                    }}
                    className="p-1 hover:bg-grey-100 rounded-lg transition-colors"
                    aria-label="إغلاق"
                  >
                    <svg
                      className="w-5 h-5 text-grey-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <p className="text-grey-600 text-center flex-1">
                    هل انت متأكد من حذف البيانات؟
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmJobDelete}
                    className="flex-1 px-4 py-3 rounded-[20px] bg-warning-500 text-white hover:bg-warning-600 transition-colors"
                  >
                    حذف البيانات
                  </button>
                  <button
                    onClick={() => {
                      setShowJobDeleteConfirm(false);
                      setJobToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-[20px] border border-grey-200 text-grey-700 hover:bg-grey-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
