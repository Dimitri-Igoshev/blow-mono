"use client";

import { Button } from "@heroui/button";
import React, { useState, useRef } from "react";
import { PiWaveform, PiRecordFill, PiStopFill } from "react-icons/pi";

import { useGetMeQuery, useUpdateUserMutation } from "@/redux/services/userApi";
import { resolveMediaUrl } from "@/common/env";
import { BlowLoader } from "./BlowLoader";

const VoiceRecorder = ({ className }: any) => {
	const [recording, setRecording] = useState(false);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const [loading, setLoading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const { data: me } = useGetMeQuery(null);
	const [update] = useUpdateUserMutation();

	const startRecording = async () => {
		if (isPlaying) {
			setIsPlaying(false);
		}

		try {
			// Очищаем перед новой записью
			setAudioUrl(null);
			chunksRef.current = [];

			// Подстраховка: остановить предыдущую запись (если вдруг она осталась)
			if (mediaRecorderRef.current) {
				stopRecording();
				await new Promise((resolve) => setTimeout(resolve, 300)); // Пауза
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			const options = MediaRecorder.isTypeSupported("audio/webm")
				? { mimeType: "audio/webm" }
				: {};

			const mediaRecorder = new MediaRecorder(stream, options);

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorder.onstop = async () => {
				setLoading(true);

				const blob = new Blob(chunksRef.current, {
					type: mediaRecorder.mimeType,
				});
				const url = URL.createObjectURL(blob);
				setAudioUrl(url);

				const formData = new FormData();
				formData.append("files", blob, `recording.${blob.type.split("/")[1]}`);

				try {
					await update({ id: me._id, body: formData }).unwrap();
				} catch (err) {
					console.error(err);
				} finally {
					setLoading(false);
				}
			};

			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start();
			setRecording(true);
		} catch (err) {
			console.error("Ошибка доступа к микрофону:", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stream.getTracks().forEach((track) => {
				track.stop(); // Остановить каждый трек
			});
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current = null;
		}
		setRecording(false);
	};

	const audioRef = useRef<any>(null);

        const handlePlay = () => {
                setIsPlaying(true);

                const resolved = me?.voice ? resolveMediaUrl(me.voice) : undefined;
                const audio = new Audio(resolved || audioUrl || "");

		// Сбросить isPlaying, когда проигрывание закончится
		audio.addEventListener("ended", () => {
			setIsPlaying(false);
		});

		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
			setIsPlaying(false); // сброс на случай ошибки
		});
	};

	return (
		<div className={className} >
			<div className="flex flex-wrap items-center gap-3">
				{(me?.voice || audioUrl) && !recording ? (
					<button
						onClick={handlePlay}
						className="bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
					>
						<PiWaveform className="w-5 h-5" />
						<p>Прослушать</p>
					</button>
				) : null}
				{isPlaying || loading ? null : (
					<Button
						className="z-0 relative"
						color="secondary"
						radius="full"
						startContent={
							recording ? (
								<PiStopFill className="w-5 h-5" />
							) : (
								<PiRecordFill className="w-5 h-5" />
							)
						}
						variant="solid"
						onPress={recording ? stopRecording : startRecording}
					>
						{recording
							? "Остановить запись"
							: me?.voice
								? "Изменить запись"
								: "Записать голос"}
					</Button>
				)}
			</div>

			{loading ? <BlowLoader text="Сохранение ..." /> : null}
		</div>
	);
};

export default VoiceRecorder;
