// import { useState } from "react";
import MovieState from "./context/MovieState";
import "./App.css";
import Lenis from "@studio-freight/lenis";
import Home from "./Components/home/Home";
import HomeV2 from "./Components/home/HomeV2";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetails from "./Components/MovieDetails/MovieDatails";
import Footer from "./Components/Footer/Footer";
import Watchlist from "./Components/Watchlist/Watchlist";
import Login from "./Components/Pages/Login";
import SignUp from "./Components/Pages/SignUp";
import IndianMovies from "./Components/Indian/IndianMovies";
import HindiMovies from "./Components/HindiMovies/HindiMovies";
import HomeIndian from "./Components/HomeIndian/HomeIndian";
import HomeIndianV2 from "./Components/HomeIndian/HomeIndianV2";
import BengaliMovies from "./Components/BengaliMovies/BengaliMovies";
import TamilMovies from "./Components/TamilMovies/TamilMovies";
import TeleguMovies from "./Components/TeleguMovies/TeleguMovies";
import KanadaMovies from "./Components/KanadaMovies/KanadaMovies";
import MalayalamMovies from "./Components/MalayalamMovies/MalayalamMovies";
import ScrollToTop from "./Components/ScrollToTop";
import GlobalMovies from "./Components/Movies/MoviesGlobal";
import MoviesGlobalV2 from "./Components/Movies/MoviesGlobalV2";
import About from "./Components/About/About";
import LegalInfo from "./Components/LegalInfo/LegalInfo";
import TermsOfService from "./Components/TermsOfService/TermsOfService";
import TvGlobal from "./Components/Movies/TvGlobal";
import TvGlobalV2 from "./Components/Movies/TvGlobalV2";
import TvDetails from "./Components/MovieDetails/TvDetails";
import SeasonDetails from "./Components/MovieDetails/SeasonDetails";
import EpisodeDetails from "./Components/MovieDetails/EpisodeDetails";
import { useEffect } from "react";
import SessionHandler from "./Components/SessionExpiredModal/SessionHandler";
import PersonDetails from "./Components/PersonDetails/PersonDetails";
import GenreMovies from "./Components/GenreMovies/GenreMovies";
import { Analytics } from "@vercel/analytics/react";
// import AuthSuccess from "./Components/Pages/AuthSuccess";

function App() {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			smoothTouch: false,
		});

		function smoothScroll(time) {
			lenis.raf(time);
			requestAnimationFrame(smoothScroll);
		}

		requestAnimationFrame(smoothScroll);
	});
	return (
		<>
			<MovieState>
				<Router>
					<ScrollToTop />
					<Navbar />
					<SessionHandler />
					<Analytics />
					{/* <Home /> */}
					<Routes>
						{/* <Route exact path="/" element={<Home />} /> */}
						<Route exact path="/" element={<HomeV2 />} />
						<Route exact path="/about" element={<About />} />
						<Route exact path="/privacy" element={<LegalInfo />} />
						<Route exact path="/terms" element={<TermsOfService />} />
						{/* <Route
							exact
							path="/globalmovies"
							element={<GlobalMovies />}
						/> */}
						<Route
							exact
							path="/globalmovies"
							element={<MoviesGlobalV2 />}
						/>
						{/* <Route exact path="/globaltv" element={<TvGlobal />} /> */}
						<Route exact path="/globaltv" element={<TvGlobalV2 />} />
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/signup" element={<SignUp />} />
						{/* <Route exact path="/indian" element={<IndianMovies />} */}

						<Route exact path="/movie/:id" element={<MovieDetails />} />
						<Route exact path="/person/:id" element={<PersonDetails />} />
						<Route exact path="/tv/:id" element={<TvDetails />} />
						<Route
							exact
							path="/tv/:id/season/:seasonNumber"
							element={<SeasonDetails />}
						/>
						<Route
							exact
							path="/tv/:id/season/:seasonNumber/episode/:episodeNumber"
							element={<EpisodeDetails />}
						/>
						<Route exact path="/watchlist" element={<Watchlist />} />
						<Route exact path="/genres" element={<GenreMovies />} />
						<Route
							exact
							path="/genres/:genreId"
							element={<GenreMovies />}
						/>
						<Route element={<IndianMovies />}>
							<Route
								exact
								path="/indianmovies"
								element={<HomeIndianV2 />}
							/>
							<Route
								exact
								path="/indianmovies/hindimovies"
								element={<HindiMovies />}
							/>
							<Route
								exact
								path="/indianmovies/bengalimovies"
								element={<BengaliMovies />}
							/>
							<Route
								exact
								path="/indianmovies/tamilmovies"
								element={<TamilMovies />}
							/>
							<Route
								exact
								path="/indianmovies/telegumovies"
								element={<TeleguMovies />}
							/>
							<Route
								exact
								path="/indianmovies/kanadamovies"
								element={<KanadaMovies />}
							/>
							<Route
								exact
								path="/indianmovies/malayalammovies"
								element={<MalayalamMovies />}
							/>
						</Route>
					</Routes>
					<Footer />
				</Router>
			</MovieState>
			<Analytics />
		</>
	);
}

export default App;
