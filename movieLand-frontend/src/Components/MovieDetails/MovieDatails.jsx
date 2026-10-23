import React, { useEffect, useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import noMovie from "../../assets/no-movie.png";
import profileLogo from "../../assets/no-profile-pic.jpeg";
import movieContext from "../../context/movieContext";
import Loading from "../Loader/Loading";
import PhotosGalleryModal from "./PhotosGalleryModal";

function MovieDetails() {
	const navigate = useNavigate();
	const [reviewIndex, setReviewIndex] = useState(0);
	const [activeReview, setActiveReview] = useState(null);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
	const [photoModalIndex, setPhotoModalIndex] = useState(0);

	const getAvatarUrl = (avatarPath) => {
		if (!avatarPath) return null;
		if (avatarPath.startsWith("/http") || avatarPath.startsWith("http")) {
			return avatarPath.startsWith("/")
				? avatarPath.substring(1)
				: avatarPath;
		}
		return `https://image.tmdb.org/t/p/w150_and_h150_face${avatarPath}`;
	};
	const [openSimilar, setOpenSimilar] = useState(true);
	const [openRecommended, setOpenRecommended] = useState(true);
	// const [isWatchlisted, setiIWatchlisted] = useState(false);
	// const [isTrailerOpen, setIsTrailerOpen] = useState(false);
	const [trailer, setTrailer] = useState(null);
	const [isMuted, setIsMuted] = useState(true);
	const iframeRef = useRef(null);

	const toggleMute = () => {
		if (!iframeRef.current) return;
		const command = isMuted ? "unMute" : "mute";
		iframeRef.current.contentWindow.postMessage(
			JSON.stringify({ event: "command", func: command }),
			"*"
		);
		setIsMuted(!isMuted);
	};

	const { id } = useParams();
	const context = useContext(movieContext);
	const {
		movieDetails,
		loadingDetails,
		fetchMovieDetails,
		movieImages,
		fetchMovieImages,
		movieReviews,
		fetchReviews,
		similarMovies,
		fetchSimilarMovies,
		movieCast,
		movieCrew,
		fetchMovieCredits,
		recommended,
		fetchRecommended,
		watchlist,
		addToWatchlist,
		removeFromWatchlist,
		fetchWatchlist,
		watched,
		addToWatched,
		removeFromWatched,
		fetchWatched,
		//eslint-disable-next-line
		movieVideos,
		fetchMovieVideos,
		providers,
		fetchProviders,
	} = context;

	useEffect(() => {
		if (!id) return;

		const loadTrailer = async () => {
			const videos = await fetchMovieVideos(id);
			const selected =
				videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
				videos.find((V) => V.site === "YouTube");
			setTrailer(selected || null);
		};

		fetchMovieDetails(id);
		fetchMovieImages(id);
		fetchReviews(id);
		fetchSimilarMovies(id);
		fetchMovieCredits(id);
		fetchRecommended(id);
		fetchMovieVideos(id);
		loadTrailer();
		fetchProviders(id);
		fetchWatchlist();
		fetchWatched();
		//eslint-disable-next-line
	}, [id]);

	const handleWatchlistClick = () => {
		if (!localStorage.getItem("token")) {
			setShowLoginModal(true);
			return;
		}

		if (isWatchlisted) {
			removeFromWatchlist(movieDetails.id);
		} else {
			addToWatchlist(movieDetails);
		}
	};

	const handleWatchedClick = () => {
		if (!localStorage.getItem("token")) {
			setShowLoginModal(true);
			return;
		}

		if (isWatched) {
			removeFromWatched(movieDetails.id);
		} else {
			addToWatched(movieDetails);
		}
	};

	useEffect(() => {
		if (activeReview) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [activeReview]);

	const isWatchlisted =
		movieDetails &&
		Array.isArray(watchlist) &&
		watchlist.some((movie) => movie.movieId === movieDetails.id);

	const isWatched =
		movieDetails &&
		Array.isArray(watched) &&
		watched.some((movie) => movie.movieId === movieDetails.id);

	const toggleSimilarOpen = () => {
		setOpenSimilar((prev) => !prev);
	};

	const toggleRecommended = () => {
		setOpenRecommended((prev) => !prev);
	};

	// const video =
	// 	movieVideos.find(
	// 		(v) =>
	// 			v.site === "YouTube" && v.name?.toLowerCase().includes("trailer"),
	// 	) || movieVideos.find((v) => v.site === "YouTube");

	if (!movieDetails || loadingDetails)
		return (
			<div className="page-loader">
				<Loading />
			</div>
		);

	// Helper calculations for cinematic details page redesign
	const releaseYear = movieDetails.release_date
		? movieDetails.release_date.split("-")[0]
		: "N/A";
	const formattedRuntime = (() => {
		const r = movieDetails.runtime;
		if (!r) return "N/A";
		const hrs = Math.floor(r / 60);
		const mins = r % 60;
		return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
	})();

	const directorName =
		movieCrew.find((member) => member.job === "Director")?.name || "N/A";
	const productionCountry =
		movieDetails.production_countries?.[0]?.name || "N/A";
	const spokenLanguage =
		movieDetails.spoken_languages?.[0]?.english_name ||
		movieDetails.original_language ||
		"N/A";
	const certification = movieDetails.adult ? "A 18+" : "U/A 13+";

	return (
		<>
			<div className="movie-details">
				{/* 1. Backdrop Hero Section with Autoplay Background Trailer */}
				<div className="detail-hero-backdrop">
					<img
						src={
							movieDetails.backdrop_path
								? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`
								: `https://image.tmdb.org/t/p/w1280${movieDetails.poster_path}`
						}
						alt={movieDetails.title}
						className="backdrop-img"
					/>
					{trailer && (
						<iframe
							ref={iframeRef}
							src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`}
							title="Movie Trailer Background"
							className="backdrop-video"
							allow="autoplay; encrypted-media; picture-in-picture"
							frameBorder="0"
						/>
					)}
					<div className="backdrop-overlay"></div>
					{trailer && (
						<button className="mute-toggle-btn" onClick={toggleMute}>
							<i className={`fa-solid ${isMuted ? "fa-volume-mute" : "fa-volume-up"}`}></i>
						</button>
					)}
				</div>

				{/* 2. Metadata Header Row */}
				<div className="detail-metadata-header">
					<div className="header-left-poster">
						<img
							src={
								movieDetails.poster_path
									? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
									: noMovie
							}
							alt={movieDetails.title}
							className="detail-poster"
						/>
					</div>
					<div className="header-center-info">
						<p className="meta-type-duration">
							Movie • {releaseYear} • {formattedRuntime}
						</p>
						<h1 className="movie-detail-title">{movieDetails.title}</h1>
						<div className="meta-details-grid">
							<div className="meta-col">
								<span className="meta-label">Directed By</span>
								<span className="meta-val">{directorName}</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Country</span>
								<span className="meta-val">{productionCountry}</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Language</span>
								<span className="meta-val">{spokenLanguage}</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Age Rating</span>
								<span className="meta-val">{certification}</span>
							</div>
						</div>
					</div>
					<div className="header-right-actions">
						<button
							className={`action-pill-btn purple-btn ${isWatched ? "watched" : ""}`}
							onClick={handleWatchedClick}
						>
							<i
								className={`fa-solid ${isWatched ? "fa-check" : "fa-plus"}`}
							></i>
							<span>{isWatched ? "Watched" : "Mark as Watched"}</span>
						</button>
						<button
							className={`action-pill-btn gray-btn ${isWatchlisted ? "in-collection" : ""}`}
							onClick={handleWatchlistClick}
						>
							<i
								className={`${isWatchlisted ? "fa-solid" : "fa-regular"} fa-bookmark`}
							></i>
							<span>
								{isWatchlisted
									? "Added to Collection"
									: "Add to Collection"}
							</span>
						</button>
					</div>
				</div>

				{/* 3. Main Overview Grid */}
				<div className="detail-overview-grid">
					<div className="overview-left-column">
						<div className="genres-section-overview">
							<h2>Overview</h2>
							<p className="overview-text">{movieDetails.overview}</p>
							<div className="genres-pills-list">
								{movieDetails.genres?.map((genre) => (
									<span
										key={genre.id}
										className="genre-pill-tag"
										onClick={() => navigate(`/genres/${genre.id}`)}
									>
										{genre.name}
									</span>
								))}
							</div>
						</div>
					</div>
					<div className="overview-right-column">
						<div className="where-to-watch-card">
							<h3>Where to Watch</h3>
							{providers && providers.length > 0 ? (
								<div className="providers-pills-grid">
									{providers.map((provider) => (
										<div
											className="provider-pill-item"
											key={provider.provider_id}
										>
											<img
												src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
												alt={provider.provider_name}
												className="provider-logo-img"
											/>
											<span className="provider-pill-name">
												{provider.provider_name}
											</span>
										</div>
									))}
								</div>
							) : (
								<p className="no-providers-msg">
									Not available to stream currently.
								</p>
							)}
						</div>
					</div>
				</div>
				{/* cast */}
				<div className="cast-section">
					<div className="center">
						<div className="bar"></div>
						<div className="bar-text">Cast</div>
					</div>

					<div className="movie-credits-wrapper">
						{movieCast.map((actor) => (
							<div
								className="movie-credits"
								key={actor.id}
								onClick={() => navigate(`/person/${actor.id}`)}
							>
								<img
									src={
										actor.profile_path
											? `https://image.tmdb.org/t/p/original${actor.profile_path}`
											: profileLogo
									}
									alt={actor.name}
									className="actor-poster"
								/>
								<p className="actor-name">{actor.name}</p>
								<p className="character-name">{actor.character}</p>
							</div>
						))}
					</div>
				</div>
				{/* crew */}
				<div className="crew-section">
					<div className="center">
						<div className="bar"></div>
						<div className="bar-text">Crew</div>
					</div>
					<div className="movie-credits-wrapper">
						{movieCrew
							.filter(
								(member) =>
									member.job === "Director" ||
									member.job === "Writter" ||
									member.job === "Producer",
							)
							.map((member) => (
								<div
									className="movie-credits"
									key={member.id}
									onClick={() => navigate(`/person/${member.id}`)}
								>
									<img
										src={
											member.profile_path
												? `https://image.tmdb.org/t/p/original${member.profile_path}`
												: profileLogo
										}
										alt={member.name}
										className="actor-poster"
									/>
									<p className="crew-name">{member.name}</p>
									<p className="crew-job">{member.job}</p>
								</div>
							))}
					</div>
				</div>
				{/* PHOTOS SECTION */}
				<div className="photos-section">
					<div className="photos-header">
						<div className="center">
							<div className="bar"></div>
							<div className="bar-text">Photos</div>
							<span>{movieImages.length}</span>
						</div>
					</div>

					<div className="photos-grid">
						{movieImages.length <= 8
							? movieImages.map((img, index) => (
									<div
										key={index}
										className="photo-card-wrapper"
										onClick={() => {
											setPhotoModalIndex(index);
											setIsPhotoModalOpen(true);
										}}
									>
										<img
											src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
											alt="movie scene"
										/>
									</div>
							  ))
							: (
									<>
										{movieImages.slice(0, 7).map((img, index) => (
											<div
												key={index}
												className="photo-card-wrapper"
												onClick={() => {
													setPhotoModalIndex(index);
													setIsPhotoModalOpen(true);
												}}
											>
												<img
													src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
													alt="movie scene"
												/>
											</div>
										))}
										<div
											className="photo-more-card"
											onClick={() => {
												setPhotoModalIndex(7);
												setIsPhotoModalOpen(true);
											}}
										>
											<img
												src={`https://image.tmdb.org/t/p/w780${movieImages[7].file_path}`}
												alt="see more scene"
											/>
											<div className="photo-more-overlay">
												<span className="photo-more-count">
													+{movieImages.length - 7}
												</span>
												<span className="photo-more-text">
													See More <i className="fa-solid fa-arrow-right"></i>
												</span>
											</div>
										</div>
									</>
							  )}
					</div>
				</div>

				{/* PHOTO GALLERY MODAL */}
				<PhotosGalleryModal
					isOpen={isPhotoModalOpen}
					onClose={() => setIsPhotoModalOpen(false)}
					images={movieImages}
					initialIndex={photoModalIndex}
				/>
				{/* reviews */}
				<div className="featured-reviews">
					<div className="center">
						<div className="bar"></div>
						<h2 className="review-heading">Featured reviews</h2>
					</div>

					{movieReviews && movieReviews.length > 0 ? (
						<div className="review-wrapper">
							{/* PREVIOUS BUTTON */}
							<button
								className="review-nav left"
								onClick={() => setReviewIndex((prev) => prev - 2)}
								disabled={reviewIndex === 0}
							>
								‹
							</button>

							{/* REVIEW CARDS */}
							<div className="review-cards">
								{movieReviews
									.slice(reviewIndex, reviewIndex + 2)
									.map((review) => {
										const content = review.content || "";
										const title = content.split(".")[0];
										const avatarUrl = getAvatarUrl(
											review.author_details?.avatar_path,
										);

										return (
											<div className="review-card" key={review.id}>
												<div className="review-header">
													<div className="review-author-info">
														{avatarUrl ? (
															<img
																src={avatarUrl}
																alt={review.author}
																className="review-avatar"
															/>
														) : (
															<div className="review-avatar-fallback">
																{review.author
																	?.charAt(0)
																	.toUpperCase() || "?"}
															</div>
														)}
														<div className="review-author-details">
															<span className="review-author-name">
																{review.author}
															</span>
															{review.author_details?.rating && (
																<span className="review-rating-badge">
																	⭐{" "}
																	{
																		review.author_details
																			.rating
																	}
																	/10
																</span>
															)}
														</div>
													</div>
												</div>

												<h3>{title}</h3>

												<p className="review-text">
													{content.length > 180
														? content.slice(0, 180) + "..."
														: content}
												</p>
												{content.length > 180 && (
													<button
														className="read-more-btn"
														onClick={() =>
															setActiveReview(review)
														}
													>
														Read More
													</button>
												)}
											</div>
										);
									})}
							</div>

							{/* NEXT BUTTON */}
							<button
								className="review-nav right"
								onClick={() => setReviewIndex((prev) => prev + 2)}
								disabled={reviewIndex + 2 >= movieReviews.length}
							>
								›
							</button>
						</div>
					) : (
						<div className="no-reviews-state">
							<i className="fa-regular fa-comments"></i>
							<p>
								No reviews available yet. Be the first to share your
								thoughts!
							</p>
						</div>
					)}
				</div>

				<div className="global-content-sections">
					{/* similar movies */}
					<div className="global-section-container">
						<div
							className={`global-section-header ${openSimilar ? "open" : ""}`}
							onClick={toggleSimilarOpen}
						>
							<div className="global-section-title-wrap">
								<h2>Similar to your choice</h2>
							</div>
							<i
								className={`fa-solid fa-chevron-down global-toggle-icon ${openSimilar ? "rotated" : ""}`}
							></i>
						</div>
						<div
							className={`global-section-content ${openSimilar ? "expanded" : ""}`}
						>
							{similarMovies && similarMovies.length !== 0 ? (
								<section className="similar-wrapper">
									{similarMovies.map((movie) => (
										<div
											className="movie-card"
											key={movie.id}
											onClick={() => navigate(`/movie/${movie.id}`)}
										>
											<div className="poster-wrapper">
												<img
													src={
														movie.poster_path
															? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
															: noMovie
													}
													alt={movie.title}
													loading="lazy"
												/>
												<span className="rating-badge">
													⭐ {movie.vote_average.toFixed(1)}
												</span>
											</div>
											<div className="movie-content">
												<h4 className="movie-title">
													{movie.title}
												</h4>
												<p className="release-date">
													Release: {movie.release_date}
												</p>
											</div>
										</div>
									))}
								</section>
							) : (
								<div className="error">
									<div className="error-emoji">
										<svg
											viewBox="0 0 48 48"
											className="sad-icon"
											style={{ fill: "currentColor" }}
										>
											<path d="M24,1A23,23,0,1,0,47,24,23,23,0,0,0,24,1Zm0,44A21,21,0,1,1,45,24,21,21,0,0,1,24,45Zm8.8-12.6a1,1,0,0,1-.2,1.4,1,1,0,0,1-.6.2,1,1,0,0,1-.8-.4A9.42,9.42,0,0,0,24,30a9.44,9.44,0,0,0-7.2,3.6,1,1,0,0,1-1.6-1.2A11.34,11.34,0,0,1,24,28,11.31,11.31,0,0,1,32.8,32.4ZM15,19a2,2,0,1,1,2,2A2,2,0,0,1,15,19Zm18,0a2,2,0,1,1-2-2A2,2,0,0,1,33,19Z" />
										</svg>
									</div>
									<div className="error-text">
										<p className="text">
											No Similar Movies Available
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* rocommended movies */}
					<div className="global-section-container">
						<div
							className={`global-section-header ${openRecommended ? "open" : ""}`}
							onClick={toggleRecommended}
						>
							<div className="global-section-title-wrap">
								<h2>Recommended Movies</h2>
							</div>
							<i
								className={`fa-solid fa-chevron-down global-toggle-icon ${openRecommended ? "rotated" : ""}`}
							></i>
						</div>
						<div
							className={`global-section-content ${openRecommended ? "expanded" : ""}`}
						>
							{recommended && recommended.length !== 0 ? (
								<section className="recommended-wrapper">
									{recommended.map((movie) => (
										<div
											className="movie-card"
											key={movie.id}
											onClick={() => navigate(`/movie/${movie.id}`)}
										>
											<div className="poster-wrapper">
												<img
													src={
														movie.poster_path
															? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
															: noMovie
													}
													alt={movie.title}
													loading="lazy"
												/>
												<span className="rating-badge">
													⭐ {movie.vote_average.toFixed(1)}
												</span>
											</div>
											<div className="movie-content">
												<h4 className="movie-title">
													{movie.title}
												</h4>
												<p className="release-date">
													Release: {movie.release_date}
												</p>
											</div>
										</div>
									))}
								</section>
							) : (
								<div className="error">
									<div className="error-emoji">
										<svg
											viewBox="0 0 48 48"
											className="sad-icon"
											style={{ fill: "currentColor" }}
										>
											<path d="M24,1A23,23,0,1,0,47,24,23,23,0,0,0,24,1Zm0,44A21,21,0,1,1,45,24,21,21,0,0,1,24,45Zm8.8-12.6a1,1,0,0,1-.2,1.4,1,1,0,0,1-.6.2,1,1,0,0,1-.8-.4A9.42,9.42,0,0,0,24,30a9.44,9.44,0,0,0-7.2,3.6,1,1,0,0,1-1.6-1.2A11.34,11.34,0,0,1,24,28,11.31,11.31,0,0,1,32.8,32.4ZM15,19a2,2,0,1,1,2,2A2,2,0,0,1,15,19Zm18,0a2,2,0,1,1-2-2A2,2,0,0,1,33,19Z" />
										</svg>
									</div>
									<div className="error-text">
										<p className="text">
											No Recommended Movies Available
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{activeReview && (
				<div
					className="review-modal-overlay"
					onClick={() => setActiveReview(null)}
					data-lenis-prevent
				>
					<div
						className="review-modal-content"
						onClick={(e) => e.stopPropagation()}
						data-lenis-prevent
					>
						<button
							className="review-modal-close"
							onClick={() => setActiveReview(null)}
						>
							✕
						</button>

						<div className="review-modal-header">
							{getAvatarUrl(activeReview.author_details?.avatar_path) ? (
								<img
									src={getAvatarUrl(
										activeReview.author_details.avatar_path,
									)}
									alt={activeReview.author}
									className="review-modal-avatar"
								/>
							) : (
								<div className="review-modal-avatar-fallback">
									{activeReview.author?.charAt(0).toUpperCase() || "?"}
								</div>
							)}
							<div className="review-modal-author-info">
								<h2>{activeReview.author}</h2>
								{activeReview.author_details?.rating && (
									<span className="review-modal-rating">
										⭐ {activeReview.author_details.rating}/10
									</span>
								)}
							</div>
						</div>

						<div className="review-modal-body" data-lenis-prevent>
							<p>{activeReview.content}</p>
						</div>
					</div>
				</div>
			)}

			{showLoginModal && (
				<div
					className="glass-modal-overlay"
					onClick={() => setShowLoginModal(false)}
				>
					<div
						className="glass-modal-content"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="glass-modal-close"
							onClick={() => setShowLoginModal(false)}
						>
							✕
						</button>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#a855f7"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="glass-modal-icon"
							style={{
								margin: "0 auto 15px auto",
								display: "block",
							}}
						>
							<rect
								width="18"
								height="11"
								x="3"
								y="11"
								rx="2"
								ry="2"
							></rect>
							<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
						</svg>
						<h2>Authentication Required</h2>
						<p>
							Please log in to mark titles as watched or add them to your
							collection.
						</p>
						<div className="glass-modal-actions">
							<button
								className="glass-login-btn"
								onClick={() => navigate("/login")}
							>
								LogIn
							</button>
							<button
								className="glass-cancel-btn"
								onClick={() => setShowLoginModal(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default MovieDetails;
