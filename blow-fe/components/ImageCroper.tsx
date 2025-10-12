"use client";

import { FunctionComponent, useRef, useState } from "react";
import ReactCrop, {
	Crop,
	PixelCrop,
	centerCrop,
	makeAspectCrop,
} from "react-image-crop";
import { LuCamera } from "react-icons/lu";
import { Button } from "@heroui/button";

import { canvasPreview } from "./canvasPreview";

import { useDebounceEffect } from "@/hooks/useDebonceEffect";
import { useHeicToJpegMutation } from "@/redux/services/uploadApi";
import { config } from "@/common/env";
import { BsFiletypeHeic } from "react-icons/bs";
import { AnimatedLogo } from "./AnimatedLogo";

interface ImageCroperProps {
	aspectRatios?: number;
	onSave: (file: any) => void;
	onClose: () => void;
}

const ImageCroper: FunctionComponent<ImageCroperProps> = ({
	aspectRatios = undefined,
	onSave,
	onClose,
}) => {
	const [file, setFile] = useState<any>(null);
	const [imgSrc, setImgSrc] = useState<string>("");
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [aspect, setAspect] = useState<number | undefined>(aspectRatios);
	const [scale, setScale] = useState(1);
	const [rotate, setRotate] = useState(0);
	const inputRef = useRef<any>(null);
	const previewCanvasRef = useRef<any>(null);
	const imgRef = useRef<any>(null);
	const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
	const blobUrlRef = useRef("");
	const [isConvertation, setIsConvertation] = useState(false);

	const [crop, setCrop] = useState<Crop>({
		unit: "%", // Can be 'px' or '%'
		x: 25,
		y: 25,
		width: 50,
		height: 50,
	});

	async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length === 0) return;

		let currentFile = e.target.files[0];

		// HEIC? ➜ конвертируем
		if (
			currentFile.type !== "image/heic" ||
			currentFile.name.toLowerCase().endsWith(".heic")
		) {
			// @ts-ignore
			setCrop(undefined);
			setFile(currentFile);

			const reader = new FileReader();
			reader.onload = () => {
				const src = reader.result?.toString() || "";

				const img = new Image();
				img.onload = () => {
					// только после полной загрузки изображения мы его отображаем
					setImgSrc(src);
				};
				img.onerror = (e) => {
					console.error("Ошибка загрузки изображения:", e);
				};
				img.src = src;
			};
			reader.readAsDataURL(currentFile);
		} else {
			setIsConvertation(true);
			const formData = new FormData();
			formData.append("file", currentFile);

			try {
				const res = await fetch(`${config.API_URL}/file/heic-to-jpeg`, {
					method: "POST",
					body: formData,
				});

				if (!res.ok) throw new Error("Ошибка конвертации HEIC");

				const jpegBlob = await res.blob(); // ⬅️ теперь это Blob

				currentFile = new File(
					[jpegBlob],
					currentFile.name.replace(/\.heic$/i, ".jpeg"),
					{ type: "image/jpeg" }
				);

				// @ts-ignore
				setCrop(undefined);
				setFile(currentFile);

				const reader = new FileReader();
				reader.onload = () => {
					const src = reader.result?.toString() || "";

					const img = new Image();
					img.onload = () => {
						// только после полной загрузки изображения мы его отображаем
						setImgSrc(src);
					};
					img.onerror = (e) => {
						console.error("Ошибка загрузки изображения:", e);
					};
					img.src = src;
				};
				reader.readAsDataURL(currentFile);
				setIsConvertation(false);
			} catch (err) {
				console.error("Ошибка HEIC→JPEG:", err);
				return;
			} finally {
				setIsConvertation(false);
			}
		}
	}

	useDebounceEffect(
		async () => {
			if (
				completedCrop?.width &&
				completedCrop?.height &&
				imgRef.current &&
				previewCanvasRef.current
			) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(
					imgRef.current,
					previewCanvasRef.current,
					completedCrop,
					scale,
					rotate
				);
			}
		},
		100,
		[completedCrop, scale, rotate]
	);

	function centerAspectCrop(
		mediaWidth: number,
		mediaHeight: number,
		aspect: number
	) {
		return centerCrop(
			makeAspectCrop(
				{
					unit: "%",
					width: 90,
				},
				aspect,
				mediaWidth,
				mediaHeight
			),
			mediaWidth,
			mediaHeight
		);
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		if (aspect) {
			const { width, height } = e.currentTarget;

			setCrop(centerAspectCrop(width, height, aspect));
		}
	}

	async function onDownloadCropClick() {
		const image = imgRef.current;
		const previewCanvas = previewCanvasRef.current;

		if (!image || !previewCanvas || !completedCrop) {
			throw new Error("Crop canvas does not exist");
		}

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;

		// Исходный кроп — полное качество
		const fullCropWidth = completedCrop.width * scaleX;
		const fullCropHeight = completedCrop.height * scaleY;

		// 1. Канвас под оригинальный кроп
		const cropCanvas = new OffscreenCanvas(fullCropWidth, fullCropHeight);
		const cropCtx = cropCanvas.getContext("2d");

		if (!cropCtx) throw new Error("No 2d context");

		cropCtx.drawImage(
			previewCanvas,
			0,
			0,
			previewCanvas.width,
			previewCanvas.height,
			0,
			0,
			cropCanvas.width,
			cropCanvas.height
		);

		// 2. Ресайз до ширины 1080 (если ширина больше)
		const maxWidth = 1080;
		const resizeScale = Math.min(1, maxWidth / fullCropWidth);
		const targetWidth = fullCropWidth * resizeScale;
		const targetHeight = fullCropHeight * resizeScale;

		const resizeCanvas = new OffscreenCanvas(targetWidth, targetHeight);
		const resizeCtx = resizeCanvas.getContext("2d");
		if (!resizeCtx) throw new Error("No resize context");

		resizeCtx.drawImage(
			cropCanvas,
			0,
			0,
			cropCanvas.width,
			cropCanvas.height,
			0,
			0,
			resizeCanvas.width,
			resizeCanvas.height
		);

		// 3. Сжимаем и получаем blob
		const blob = await resizeCanvas.convertToBlob({
			type: "image/jpeg",
			quality: 0.75, // меньше — меньше вес
		});

		// 4. Сохраняем
		onSave({ name: file?.name || "", blob });
		onClose();

		if (blobUrlRef.current) {
			URL.revokeObjectURL(blobUrlRef.current);
		}

		blobUrlRef.current = URL.createObjectURL(blob);

		if (hiddenAnchorRef.current) {
			hiddenAnchorRef.current.href = blobUrlRef.current;
			hiddenAnchorRef.current.click();
		}
	}

	return (
		<div className="">
			<div className="">
				<div className="text-lg font-[600] px-6 pt-4">Добавление фото</div>
			</div>
			<div className="flex flex-col gap-4 p-6 pt-5">
				{isConvertation ? (
					<div className="flex flex-col gap-3 items-center justify-center py-10">
						{/* <BsFiletypeHeic className="w-[100px] h-[100px]" /> */}
						<AnimatedLogo />
						<p>
							Конвертация <span className="text-primary">HEIC → JPEG</span>
						</p>
					</div>
				) : imgSrc ? (
					<div className="">
						<ReactCrop
							aspect={aspect}
							crop={crop}
							onChange={(c: any) => setCrop(c)}
							onComplete={(c) => setCompletedCrop(c)}
						>
							<img ref={imgRef} alt="" src={imgSrc} onLoad={onImageLoad} />
						</ReactCrop>
					</div>
				) : null}

				<div className="grid grid-cols-[1fr] gap-6 w-full">
					<div className="hidden w-[100px] h-[100px] rounded-full overflow-hidden">
						{completedCrop ? (
							<canvas
								ref={previewCanvasRef}
								style={{
									borderRadius: "100%",
									objectFit: "contain",
									width: "100px",
									height: "100px",
								}}
							/>
						) : (
							<div className="w-full h-full flex justify-center items-center text-white bg-foreground-200">
								Превью
							</div>
						)}
					</div>

					{isConvertation ? null : (
						<div className="grid grid-cols-[3fr_2fr] w-full gap-3 mt-1">
							<input
								ref={inputRef}
								className="hidden"
								type="file"
								onChange={onSelectFile}
							/>
							<Button
								color="primary"
								endContent={<LuCamera className="text-lg" />}
								radius="full"
								variant="ghost"
								onPress={() => inputRef.current.click()}
							>
								{file ? "Другое фото" : "Выберите фото"}
							</Button>
							<Button
								className="text-white"
								color="primary"
								// isDisabled={!completedCrop}
								radius="full"
								onPress={onDownloadCropClick}
							>
								Cохранить
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ImageCroper;
