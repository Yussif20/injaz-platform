"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button, Modal, Input } from "@/shared/components/ui";
import { useCreateUser } from "../hooks";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../validations/users.schemas";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  // Users-specific translations (fallback inline)
  const modalT = {
    title: "إضافة عميل",
    phone: "رقم الهاتف",
    phonePlaceholder: "05xxxxxxxx",
    password: "كلمة المرور",
    passwordPlaceholder: "********",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل الاسم الكامل",
    role: "الدور",
    selectRole: "اختر الدور",
    admin: "مدير",
    teacher: "معلم",
    add: "إضافة",
  };

  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      phone: "",
      password: "",
      fullName: "",
      role: "Teacher",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        phone: "",
        password: "",
        fullName: "",
        role: "Teacher",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: CreateUserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => onSuccess?.(),
      onError: () => {},
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalT.title}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={modalT.fullName}
          placeholder={modalT.fullNamePlaceholder}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label={modalT.phone}
          placeholder={modalT.phonePlaceholder}
          error={errors.phone?.message}
          dir="ltr"
          {...register("phone")}
        />

        <Input
          label={modalT.password}
          placeholder={modalT.passwordPlaceholder}
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-text-dark">
            {modalT.role}
          </label>
          <select
            {...register("role")}
            className="w-full rounded-lg border border-grey-200 bg-[#f6f6f6] px-4 py-2.5 text-sm text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          >
            <option value="Teacher">{modalT.teacher}</option>
            <option value="Admin">{modalT.admin}</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-xs text-warning-500">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full rounded-[20px]! font-light!"
          size="lg"
          loading={createUser.isPending}
        >
          <Plus className="h-5 w-5" />
          {modalT.add}
        </Button>
      </form>
    </Modal>
  );
}
