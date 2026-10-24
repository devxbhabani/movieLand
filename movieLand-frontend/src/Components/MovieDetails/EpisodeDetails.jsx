import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import "./EpisodeDetails.css";
import profileLogo from "../../assets/no-profile-pic.jpeg";
import noMovie from "../../assets/no-movie.png";
import movieContext from "../../context/movieContext";
import Loading from "../Loader/Loading";
import PhotosGalleryModal from "./PhotosGalleryModal";

function EpisodeDetails() {
	const navigate = useNavigate();
	const [reviewIndex, setReviewIndex] = useState(0);
	const [activeReview, setActiveReview] = useState(null);
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
	const [isTrailerOpen, setIsTrailerOpen] = useState(false);
	const [trailer, setTrailer] = useState(null);
	const { id, seasonNumber, episodeNumber } = useParams();
	const context = useContext(movieContext);
	const {
		seasonDetails,
		fetchSeasonDetails,
		tvDetails,
		fetchTvDetails,
		episodeDetails,
		loadingDetails,
		fetchEpisodeDetails,
		tvImages,
		fetchTvImages,
		tvReviews,
		fetchTvReviews,
		similarTvShows,
		fetchSimilarTvShows,
		tvCast,
		tvCrew,
		fetchTvCredits,
		recommendedTvShows,
		fetchRecommendedTvShows,
		// watchlistTv,
		// addToWatchlistTv,
		// removeFromWatchlistTv,
		fetchWatchlist,

		tvVideos,
		fetchTvVideos,
		tvProviders,
		fetchTvProviders,
		seasonVideos,
		fetchSeasonVideos,
		episodeVideos,
		fetchEpisodeVideos,
	} = context;

	useEffect(() => {
		if (!id) return;

		// const loadTrailer = async () => {
		// 	const videos = await fetchTvVideos(id);
		// 	const selected =
		// 		videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
		// 		videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
		// 		videos.find(
		// 			(v) => v.site === "YouTube" && v.type === "Opening Credits",
		// 		) ||
		// 		videos.find((v) => v.site === "YouTube");

		// 	setTrailer(selected || null);
		// };

		const loadTrailer = async () => {
			try {
				// Try Episode Videos
				const episodeVideos = await fetchEpisodeVideos(
					id,
					seasonNumber,
					episodeNumber,
				);

				const filterTrailer = (videos) =>
					videos.find(
						(v) => v.site === "YouTube" && v.type === "Trailer",
					) ||
					videos.find(
						(v) => v.site === "YouTube" && v.type === "Teaser",
					) ||
					videos.find(
						(v) => v.site === "YouTube" && v.type === "Opening Credits",
					) ||
					videos.find((v) => v.site === "YouTube");

				let selected = filterTrailer(episodeVideos);

				// 2️⃣ If no episode trailer → Try Season
				if (!selected) {
					const seasonVideos = await fetchSeasonVideos(id, seasonNumber);
					selected = filterTrailer(seasonVideos);
				}

				// 3️⃣ If no season trailer → Try Show
				if (!selected) {
					const showVideos = await fetchTvVideos(id);
					selected = filterTrailer(showVideos);
				}

				setTrailer(selected || null);
			} catch (error) {
				console.error("Error loading trailer:", error);
				setTrailer(null);
			}
		};

		loadTrailer();

		fetchSeasonDetails(id, seasonNumber);
		fetchEpisodeDetails(id, seasonNumber, episodeNumber);
		fetchTvDetails(id);
		fetchTvImages(id);
		fetchTvReviews(id);
		fetchSimilarTvShows(id);
		fetchTvCredits(id);
		fetchRecommendedTvShows(id);
		fetchTvVideos(id);
		// loadTrailer();
		fetchTvProviders(id);
		fetchWatchlist();
		//eslint-disable-next-line
	}, [id, seasonNumber, episodeNumber]);

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

	// const isWatchlisted =
	// 	seasonDetils &&
	// 	Array.isArray(watchlistTv) &&
	// 	watchlistTv.some(
	// 		(movie) =>
	// 			movie.movieId === seasonDetils.id && movie.media_type == "tv",
	// 	);

	const toggleSimilarOpen = () => {
		setOpenSimilar((prev) => !prev);
	};

	const toggleRecommended = () => {
		setOpenRecommended((prev) => !prev);
	};

	const handleBack = async () => {
		navigate(`/tv/${id}/season/${seasonNumber}`);
	};
	const handleBackShow = async () => {
		navigate(`/tv/${id}`);
	};

	if (
		!episodeDetails ||
		!tvDetails ||
		!seasonDetails ||
		!tvVideos ||
		!seasonVideos ||
		!episodeVideos ||
		loadingDetails
	)
		return (
			<div className="page-loader">
				<Loading />
			</div>
		);

	const releaseYear = episodeDetails.air_date ? episodeDetails.air_date.split("-")[0] : "N/A";

	return (
		<>
			<div className="movie-details">
				{/* 1. Backdrop Hero Section with Centered Play Button */}
				<div className="detail-hero-backdrop">
					<img
						src={
							tvDetails.backdrop_path
								? `https://image.tmdb.org/t/p/w1280${tvDetails.backdrop_path}`
								: `https://image.tmdb.org/t/p/w1280${episodeDetails.still_path}`
						}
						alt={episodeDetails.name}
						className="backdrop-img"
					/>
					<div className="backdrop-overlay"></div>
				</div>

				{/* 2. Metadata Header Row */}
				<div className="detail-metadata-header">
					<div className="header-left-poster">
						<img
							src={
								episodeDetails.still_path
									? `https://image.tmdb.org/t/p/w500${episodeDetails.still_path}`
									: seasonDetails.poster_path
									? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
									: noMovie
							}
							alt={episodeDetails.name}
							className="detail-poster"
						/>
					</div>
					<div className="header-center-info">
						<p className="meta-type-duration">
							TV Episode • {releaseYear} • {episodeDetails.runtime || "N/A"} min
						</p>
						<h1 className="movie-detail-title">
							<span onClick={() => handleBackShow()} style={{ cursor: "pointer" }}>{tvDetails.name}</span>
							<span style={{ color: "rgba(255,255,255,0.4)", margin: "0 10px" }}>›</span>
							<span onClick={() => handleBack()} style={{ cursor: "pointer", color: "var(--theme-accent, #E50914)" }}>S{seasonNumber}</span>
							<span style={{ color: "rgba(255,255,255,0.4)", margin: "0 10px" }}>›</span>
							<span style={{ color: "#f63049" }}>E{episodeNumber}</span>
							<span style={{ color: "rgba(255,255,255,0.4)", margin: "0 15px" }}>:</span>
							<span>{episodeDetails.name}</span>
						</h1>
						<div className="meta-details-grid">
							<div className="meta-col">
								<span className="meta-label">Air Date</span>
								<span className="meta-val">{episodeDetails.air_date || "N/A"}</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Rating</span>
								<span className="meta-val">⭐ {episodeDetails.vote_average?.toFixed(1) || "N/A"}</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Runtime</span>
								<span className="meta-val">{episodeDetails.runtime || "N/A"} min</span>
							</div>
							<div className="meta-col">
								<span className="meta-label">Show Status</span>
								<span className="meta-val">{tvDetails.status || "N/A"}</span>
							</div>
						</div>
					</div>
					<div className="header-right-actions">
						<button className="action-pill-btn gray-btn" onClick={handleBack} style={{ width: "160px" }}>
							<i className="fa-solid fa-arrow-left"></i>
							<span>Back to Season</span>
						</button>
					</div>
				</div>

				{/* 3. Media Grid (Poster left, Autoplay Trailer right) */}
				<div className="episode-media-grid">
					<div className="episode-poster-showcase">
						<img
							src={
								seasonDetails.poster_path
									? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
									: tvDetails.poster_path
									? `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`
									: noMovie
							}
							alt={seasonDetails.name}
							className="episode-showcase-poster-img"
						/>
					</div>
					<div className="episode-trailer-autoplay">
						{trailer?.key ? (
							<div className="video-player-container">
								<iframe
									src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
									title="Episode Trailer"
									allow="autoplay; encrypted-media; picture-in-picture"
									allowFullScreen
								/>
							</div>
						) : (
							<div className="no-trailer-placeholder">
								<p>Trailer not available for this episode.</p>
							</div>
						)}
					</div>
				</div>

				{/* 4. Text Details Grid */}
				<div className="detail-overview-grid">
					<div className="overview-left-column">
						<div className="genres-section-overview">
							<h2>Overview</h2>
							<p className="overview-text">{episodeDetails.overview || "No overview available for this episode."}</p>
							<div className="genres-pills-list" style={{ marginBottom: "30px" }}>
								{tvDetails.genres?.map((genre) => (
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

						{/* Episodes List from the current season (design like Season Details page) */}
						{seasonDetails.episodes && seasonDetails.episodes.length > 0 && (
							<div className="episodes-section-redesign" style={{ marginTop: "20px" }}>
								<div className="center" style={{ justifyContent: "flex-start", marginBottom: "15px" }}>
									<div className="bar" style={{ background: "#8b5cf6" }}></div>
									<h3 style={{ fontSize: "1.4rem", fontWeight: "600", color: "white", margin: 0 }}>Episodes</h3>
								</div>
								<div className="genres-pills-list">
									{seasonDetails.episodes.map((episode) => {
										const isActive = episode.episode_number === parseInt(episodeNumber);
										return (
											<span
												key={episode.id}
												className={`genre-pill-tag ${isActive ? "active-episode-pill" : ""}`}
												style={{
													border: isActive ? "1px solid var(--theme-accent, #E50914)" : "1px solid rgba(229, 9, 20, 0.3)",
													background: isActive ? "rgba(229, 9, 20, 0.2)" : "transparent",
													color: isActive ? "var(--theme-accent, #ffffff)" : "white"
												}}
												onClick={() =>
													navigate(
														`/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`,
													)
												}
											>
												{episode.name}
											</span>
										);
									})}
								</div>
							</div>
						)}
					</div>
					<div className="overview-right-column">
						{/* MovieLand Rating Card */}
						<div className="imdb-rating-card">
							<div className="rating-card-star">⭐</div>
							<div>
								<span className="rating-card-value">
									{episodeDetails.vote_average?.toFixed(1) || "N/A"}
									<span className="rating-card-max">/10</span>
								</span>
								<p className="rating-card-count">
									{episodeDetails.vote_count || 0} Ratings
								</p>
							</div>
						</div>

						<div className="where-to-watch-card">
							<h3>Where to Watch</h3>
							{tvProviders && tvProviders.length > 0 ? (
								<div className="providers-pills-grid">
									{tvProviders.map((provider) => (
										<div className="provider-pill-item" key={provider.provider_id}>
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
								<p className="no-providers-msg">Not available to stream currently.</p>
							)}
						</div>
					</div>
				</div>
				{/* cast */}
				<div className="cast-section">
					<div className="center">
						<div className="bar"></div>
						<h2>Cast</h2>
					</div>
					{tvCast && tvCast.length > 0 ? (
						<div className="movie-credits-wrapper">
							{tvCast.map((actor) => (
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
					) : (
						<p className="no-cast">No cast information available.</p>
					)}
				</div>
				{/* crew */}
				<div className="crew-section">
					<div className="center">
						<div className="bar"></div>
						<h2>Crew</h2>
					</div>
					{tvCrew && tvCrew.length > 0 ? (
						<div className="movie-credits-wrapper">
							{tvCrew
								.filter(
									(member) =>
										member.job === "Director" ||
										member.job === "Writter" ||
										member.job === "Producer" ||
										member.known_for_department === "Writing" ||
										member.known_for_department === "Editing",
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
					) : (
						<p className="no-cast">No crew information available.</p>
					)}
				</div>
				{/* PHOTOS SECTION */}
				<div className="photos-section">
					<div className="photos-header">
						<div className="center">
							<div className="bar"></div>
							<h2>Photos</h2>
							<span>{tvImages.length}</span>
						</div>
					</div>

					<div className="photos-grid">
						{tvImages.length <= 8
							? tvImages.map((img, index) => (
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
											alt="episode scene"
										/>
									</div>
							  ))
							: (
									<>
										{tvImages.slice(0, 7).map((img, index) => (
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
													alt="episode scene"
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
												src={`https://image.tmdb.org/t/p/w780${tvImages[7].file_path}`}
												alt="see more scene"
											/>
											<div className="photo-more-overlay">
												<span className="photo-more-count">
													+{tvImages.length - 7}
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
					images={tvImages}
					initialIndex={photoModalIndex}
				/>
				{/* reviews */}
				<div className="featured-reviews">
					<div className="center">
						<div className="bar"></div>
						<h2 className="review-heading">Featured reviews</h2>
					</div>

					{tvReviews && tvReviews.length > 0 ? (
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
								{tvReviews
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
								disabled={reviewIndex + 2 >= tvReviews.length}
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
							{similarTvShows && similarTvShows.length !== 0 ? (
								<section className="similar-wrapper">
									{similarTvShows.map((movie) => (
										<div
											className="movie-card"
											key={movie.id}
											onClick={() => navigate(`/tv/${movie.id}`)}
										>
											<div className="poster-wrapper">
												<img
													src={
														movie.poster_path
															? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
															: noMovie
													}
													alt={movie.name}
													loading="lazy"
												/>
												<span className="rating-badge">
													⭐ {movie.vote_average.toFixed(1)}
												</span>
											</div>
											<div className="movie-content">
												<h4 className="movie-title">
													{movie.name}
												</h4>
												<p className="release-date">
													Release: {movie.first_air_date}
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
							{recommendedTvShows && recommendedTvShows.length !== 0 ? (
								<section className="recommended-wrapper">
									{recommendedTvShows.map((movie) => (
										<div
											className="movie-card"
											key={movie.id}
											onClick={() => navigate(`/tv/${movie.id}`)}
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
													{movie.name}
												</h4>
												<p className="release-date">
													Release: {movie.first_air_date}
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
			{isTrailerOpen && trailer && (
				<div
					className="video-modal"
					onClick={() => setIsTrailerOpen(false)}
				>
					<div
						className="video-content"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="close-btn"
							onClick={() => setIsTrailerOpen(false)}
						>
							✕
						</button>

						<iframe
							src={`https://www.youtube.com/embed/${trailer.key}`}
							title="Movie Trailer"
							allow="encrypted-media; picture-in-picture"
							allowFullScreen
						/>
					</div>
				</div>
			)}

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
		</>
	);
}

export default EpisodeDetails;
