import { Button, cn } from "@heroui/react";
import { useRef } from "react";
import { GoPaperclip } from "react-icons/go";

const FileUploadButton = ({ onFileSelect, className }: any) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			onFileSelect(event.target.files[0]); // передаем выбранный файл в родительский компонент
		}
	};

	return (
		<div className={cn("", className)}>
			<Button
				isIconOnly
				className=""
				color="secondary"
				radius="full"
				variant="solid"
				onPress={handleButtonClick}
			>
				<GoPaperclip />
			</Button>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>
		</div>
	);
};

export default FileUploadButton;
