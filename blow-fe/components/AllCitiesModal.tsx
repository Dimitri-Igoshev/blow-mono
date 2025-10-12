"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSearch } from "@/redux/features/searchSlice";
// import { cities } from "@/data/cities";
import { ROUTES } from "@/app/routes";
import { useGetCitiesQuery } from "@/redux/services/cityApi"

interface AllCitiesModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

export const AllCitiesModal: FC<AllCitiesModalProps> = ({
	isOpen,
	onOpenChange,
}) => {
	const { data: cities } = useGetCitiesQuery(null)
	const router = useRouter();
	const dispatch = useDispatch();
	const search = useSelector((state: any) => state.search.search);

	return (
		<Modal
			backdrop="blur"
			className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
			classNames={{
				closeButton: "m-3.5",
			}}
			isOpen={isOpen}
			placement="top"
			size="5xl"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-[20px]">
							Все города
						</ModalHeader>
						<ModalBody>
							<div className="columns-2 md:columns-3 lg:columns-4 mb-2 -mt-1 gap-2">
								{cities?.map((city: any) => (
									<button
										key={city.value}
										className="block hover:text-primary hover:underline py-1 overflow-hidden break-words text-left max-w-full"
										onClick={() => {
											dispatch(
												setSearch({
													...search,
													city: city.value,
												})
											);
											router.push(ROUTES.ACCOUNT.SEARCH);
										}}
									>
										{city.label}
									</button>
								))}
							</div>
						</ModalBody>
						{/* <ModalFooter>
							<div className="flex gap-3 items-end">
								<Button className="w-full" radius="full" onPress={onClose}>
									Закрыть
								</Button>
							</div>
						</ModalFooter> */}
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
