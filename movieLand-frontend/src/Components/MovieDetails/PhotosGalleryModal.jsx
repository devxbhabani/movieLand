import React, { useState, useEffect } from "react";
import "./PhotosGalleryModal.css";

const PhotosGalleryModal = ({ isOpen, onClose, images = [], initialIndex = 0 }) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	useEffect(() => {
		setCurrentIndex(initialIndex);
	}, [initialIndex, isOpen]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!isOpen) return;
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "ArrowLeft") {
				handlePrev();
			} else if (e.key === "ArrowRight") {
				handleNext();
			}
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, currentIndex, images.length]);

	if (!isOpen || !images || images.length === 0) return null;

	const handlePrev = (e) => {
		if (e) e.stopPropagation();
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = (e) => {
		if (e) e.stopPropagation();
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const currentImg = images[currentIndex];
	const imageSrc = currentImg
		? `https://image.tmdb.org/t/p/original${currentImg.file_path || currentImg.still_path || ""}`
		: "";

	return (
		<div className="photo-modal-overlay" onClick={onClose}>
			<div className="photo-modal-wrapper" onClick={(e) => e.stopPropagation()}>
				{/* Top bar with count and close */}
				<div className="photo-modal-topbar">
					<div className="photo-modal-counter">
						<span>{currentIndex + 1}</span> / {images.length}
					</div>
					<button className="photo-modal-close" onClick={onClose} aria-label="Close modal">
						✕
					</button>
				</div>

				{/* Main Image and navigation buttons */}
				<div className="photo-modal-main">
					{images.length > 1 && (
						<button
							className="photo-modal-nav prev"
							onClick={handlePrev}
							aria-label="Previous photo"
						>
							‹
						</button>
					)}

					<div className="photo-modal-image-container">
						<img
							key={currentIndex}
							src={imageSrc}
							alt={`Scene ${currentIndex + 1}`}
							className="photo-modal-img"
						/>
					</div>

					{images.length > 1 && (
						<button
							className="photo-modal-nav next"
							onClick={handleNext}
							aria-label="Next photo"
						>
							›
						</button>
					)}
				</div>

				{/* Thumbnail strip */}
				{images.length > 1 && (
					<div className="photo-modal-thumbnails" data-lenis-prevent>
						{images.map((img, idx) => (
							<img
								key={idx}
								src={`https://image.tmdb.org/t/p/w300${img.file_path || img.still_path}`}
								alt={`Thumbnail ${idx + 1}`}
								className={`photo-thumb ${idx === currentIndex ? "active" : ""}`}
								onClick={() => setCurrentIndex(idx)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PhotosGalleryModal;
