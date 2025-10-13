"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Image } from "@heroui/image";
import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { TiStarFullOutline } from "react-icons/ti";
import { IoTrash } from "react-icons/io5";
import { BsFillCameraFill } from "react-icons/bs";

import ImageCroper from "./ImageCroper";

import { resolveMediaUrl } from "@/common/env";
import { IPhoto } from "@/common/interface/photo.interface";
import { useUpdateUserMutation } from "@/redux/services/userApi";

interface UploadImagesProps {
	data?: any[];
	isEdit?: boolean;
	onAdd: (images: IPhoto) => void;
	onChange: (images: IPhoto[]) => void;
	onRemove: (images: IPhoto) => void;
	onSetMain: (images: IPhoto[]) => void;
}

const UploadImages: FC<UploadImagesProps> = ({
	data = [],
	isEdit = true,
	onAdd,
	onChange,
	onRemove,
	onSetMain,
}) => {
	const [images, setImages] = useState(data);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const addImage = (file: File) => {
		if (!file || !file?.type.toString().includes("image")) {
			return;
		}

		if (isEdit) onAdd({ file, url: URL.createObjectURL(file), main: false });

		onChange([
			...images,
			{ file, url: URL.createObjectURL(file), main: false },
		]);

		if (!isEdit) {
			setImages([
				...images,
				{ file, url: URL.createObjectURL(file), main: false },
			]);
		} else {
			// @ts-ignore
			setImages([...data] || []);
		}
	};

	const setMainImage = (url: string) => {
		const imgs: IPhoto[] = [];
		const currentImage = images.find((i: IPhoto) => i.url === url);

		images.forEach((i: IPhoto) => {
			imgs.push({ ...i, main: i.url === url });
		});

		const filteredImages: IPhoto[] = imgs.filter((i: IPhoto) => !i.main);

		if (currentImage) filteredImages.unshift(currentImage);

		if (isEdit) onSetMain(filteredImages);

		onChange(filteredImages);

		if (!isEdit) {
			setImages(filteredImages);
		} else {
			// @ts-ignore
			setImages([...data] || []);
		}
	};

	const removeImage = (idx: number) => {
		const imgs = [...images];

		imgs.splice(idx, 1);
		setImages(imgs);

		onChange(imgs);

		onRemove(images[idx]);
	};

	useEffect(() => {
		// @ts-ignore
		setImages([...data] || []);
	}, [data]);

	const inputRef = useRef<any>(null);

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		//   if (!e.target.files || e.target.files.length > 0 || !e.target.files[0]?.type.toString().includes("image")) {
		// 	return;
		// }

		// if (isEdit) onAdd({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]), main: false });

		// onChange([
		// 	...images,
		// 	{ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]), main: false },
		// ]);

		// if (!isEdit) {
		// 	setImages([
		// 		...images,
		// 		{ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]), main: false },
		// 	]);
		// } else {
		// 	// @ts-ignore
		// 	setImages([...data] || []);
		// }

		if (e.target.files && e.target.files.length > 0) {
			onAdd({
				file: e.target.files[0],
				url: URL.createObjectURL(e.target.files[0]),
				main: false,
			});
		}
	};

	  const ref = useRef<any>(null);

  const [width, setWidth] = useState<number | null>();

  useEffect(() => {
    if (ref?.current?.offsetWidth) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref?.current?.offsetWidth]);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-5 gap-5 w-full">
			{images.map(({ file, url, main }: IPhoto, idx: number) => (
				<div
				ref={ref}
					key={url}
					className="col-span-1 rounded-[27px] overflow-hidden relative group"
				>
					<Image
						alt=""
						className="z-0 relative"
						height={width ? width * 1.5 : 0}
						radius="none"
                                                src={resolveMediaUrl(url) || ""}
						width={"100%"}
            style={{ objectFit: "cover" }}
					/>

					{idx > 0 && (
						<button
							className="hidden group-hover:flex absolute top-2.5 left-2.5 w-[40px] h-[40px] rounded-full bg-white/50 dark:bg-dark/50 cursor-pointer items-center justify-center hover:bg-primary hover:text-white hover:dark:bg-primary hover:dark:text-white transition-all"
							onClick={() => setMainImage(url)}
						>
							<TiStarFullOutline size={24} />
						</button>
					)}

					<button
						className="hidden group-hover:flex absolute top-2.5 right-2.5 w-[40px] h-[40px] rounded-full bg-white/50 dark:bg-dark/50 cursor-pointer items-center justify-center hover:bg-primary hover:text-white hover:dark:bg-primary hover:dark:text-white transition-all"
						onClick={() => removeImage(idx)}
					>
						<IoTrash size={20} />
					</button>
				</div>
			))}

			<button
				className="col-span-1 bg-white min-h-[300px] dark:bg-foreground-100 rounded-[27px] flex justify-center items-center group z-0 relative"
				onClick={() => inputRef.current.click()}
			>
				<div className="flex flex-col items-center gap-3 group-hover:text-primary transition-all">
					<BsFillCameraFill size={36} />
					<p className="font-semibold">Добавить фото</p>
					<input
						ref={inputRef}
						className="hidden"
						type="file"
						onChange={onSelectFile}
					/>
				</div>
			</button>
		</div>
	);
};

export default UploadImages;
