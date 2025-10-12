"use client";

import { NoteCard } from "@/components/NoteCard";
import { useDeleteNoteMutation, useGetMeQuery } from "@/redux/services/userApi";

export default function AccountNotes() {
	const { data: me } = useGetMeQuery(null);

	const [deleteNote] = useDeleteNoteMutation();

	const removeNote = async (note: any) => {
		if (!me?._id || !note?._id) return;
		deleteNote({ id: me?._id, body: { userId: note._id } }).unwrap();
	};

	return (
		<div className="flex w-full flex-col px-3 sm:px-9 min-h-screen pt-[84px] gap-[30px]">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Заметки</h1>
			</div>

			{me?.notes?.length ? (
				<div className="flex flex-col gap-3">
					{me.notes.map((note: any) => (
						<NoteCard
							key={note._id}
							note={note}
							onDelete={() => removeNote(note)}
						/>
					))}
				</div>
			) : (
				<p>Еще нет заметок...</p>
			)}
		</div>
	);
}
