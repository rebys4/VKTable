import React from "react";
import "./createForm.css";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "../../api/recordsApi";
import { Record } from "../../types/Record";

const fields: { name: keyof Omit<Record, "id">; label: string; type?: string; required?: boolean }[] = [
  { name: "name", label: "Имя", required: true },
  { name: "email", label: "Email", required: true, type: "email" },
  { name: "age", label: "Возраст", required: true, type: "number" },
  { name: "address", label: "Адрес", required: true },
  { name: "phone", label: "Телефон", required: true, type: "tel" },
];

type FormData = Omit<Record, "id">;

const CreateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => createRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      reset();
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="create-form">
      {fields.map(field => (
        <div key={field.name}>
          <input
            {...register(field.name, { required: field.required ? `${field.label} обязательно` : false })}
            placeholder={field.label}
            type={field.type || "text"}
          />
          {errors[field.name] && (
            <span style={{ color: "red" }}>{(errors[field.name] as any).message}</span>
          )}
        </div>
      ))}
      <button type="submit" disabled={isSubmitting || mutation.isPending}>
        Создать
      </button>
      {mutation.isPending && <span style={{ marginLeft: 10 }}>Отправка...</span>}
      {mutation.isError && <span style={{ color: "red", marginLeft: 10 }}>Ошибка!</span>}
      {mutation.isSuccess && <span style={{ color: "green", marginLeft: 10 }}>Успешно!</span>}
    </form>
  );
};

export default CreateForm;