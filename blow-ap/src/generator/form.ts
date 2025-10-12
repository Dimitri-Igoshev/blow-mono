// import React from "react";
// import { useForm } from "react-hook-form";
import { z } from 'zod';
// import { zodResolver } from "@hookform/resolvers/zod";
import { OpenAPIV3 } from 'openapi-types';
// import { Button, Form, Input } from "@heroui/react";

// Генерация Zod-схемы из OpenAPI-схемы с поддержкой всех типов и x-ui
export function generateZodSchema(
  openApiSchema: OpenAPIV3.SchemaObject
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  const properties = openApiSchema.properties;

  if (!properties || typeof properties !== 'object') {
    throw new Error('Invalid OpenAPI schema: missing or invalid properties');
  }

  for (const [key, prop] of Object.entries(properties)) {
    const schema = prop as OpenAPIV3.SchemaObject;

    let validator: z.ZodTypeAny;

    const type = schema.type;
    const format = schema.format;

    switch (type) {
      case 'string':
        validator = z.string();
        //@ts-ignore
        if (format === 'email') validator = validator.email();
        //@ts-ignore
        else if (format === 'uuid') validator = validator.uuid();
        //@ts-ignore
        else if (format === 'date-time')
          //@ts-ignore
          validator = validator.datetime?.() ?? validator;
        break;

      case 'number':
        validator = z.number();
        break;

      case 'integer':
        validator = z.number().int();
        break;

      case 'boolean':
        validator = z.boolean();
        break;

      case 'array':
        if (schema.items) {
          const itemSchema = generateZodSchema(schema.items as OpenAPIV3.SchemaObject);

          validator = z.array(itemSchema);
        } else {
          validator = z.array(z.any());
        }
        break;

      case 'object':
        if (schema.properties) {
          validator = generateZodSchema(schema); // рекурсия
        } else {
          //@ts-ignore
          validator = z.record(z.any());
        }
        break;

      default:
        validator = z.any();
    }

    if (openApiSchema.required?.includes(key)) {
      // ничего не делаем — поле обязательное
    } else {
      validator = validator.optional();
    }

    // Обработка x-ui и других расширений можно вставить сюда

    shape[key] = validator;
  }

  return z.object(shape);
}

// Генерация React-формы с учетом x-ui и всех типов
// export function generateFormFromOpenApi(schema: any, name: string): React.FC {
// 	const zodSchema = generateZodSchema(schema);
// 	type FormValues = z.infer<typeof zodSchema>;

// 	return function GeneratedForm() {
// 		const form = useForm<FormValues>({
// 			resolver: zodResolver(zodSchema),
// 			defaultValues: Object.fromEntries(
// 				Object.keys(schema.properties).map((key) => [
// 					key,
// 					schema.properties[key].type === "boolean" ? false : "",
// 				])
// 			) as FormValues,
// 		});

// const onSubmit = (data: FormValues) => {
// 	console.log(`${name} submitted:`, data);
// };

// return (
//   <Form {...form}>
//     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-semibold text-center">{name}</h2>

//       {Object.entries(schema.properties).map(([fieldName, prop]) => {
//         const ui = prop['extensions']?.['x-ui'] || {};
//         const label = ui.label || fieldName;
//         const placeholder = ui.placeholder || '';
//         const widget = ui.widget || prop.type;

//         return (
//           <FormField
//             key={fieldName}
//             control={form.control}
//             name={fieldName as keyof FormValues}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{label}</FormLabel>
//                 <FormControl>
//                   {widget === 'textarea' ? (
//                     <Textarea placeholder={placeholder} {...field} />
//                   ) : widget === 'checkbox' || prop.type === 'boolean' ? (
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                   ) : widget === 'select' && Array.isArray(prop.enum) ? (
//                     <select {...field} className="border rounded px-3 py-2 w-full">
//                       {prop.enum.map((option: string) => (
//                         <option key={option} value={option}>{option}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <Input
//                       type={prop.format === 'password' ? 'password' : prop.format === 'email' ? 'email' : 'text'}
//                       placeholder={placeholder}
//                       {...field}
//                     />
//                   )}
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         );
//       })}

//       <Button type="submit" className="w-full">
//         Отправить
//       </Button>
//     </form>
//   </Form>
// );
// 	}
// }
