import React from "react";

export const Footer: React.FC = () => {
	return (
		<footer id="footer" className="flex flex-row justify-center mt-4">
			<a
				href="https://github.com/HarryWillis0"
				target="_blank"
				rel="noopener noreferrer"
				className="icon-button text-4xl mx-5"
				aria-label="github"
			>
				<i className="fa-brands fa-github"></i>
			</a>
			<a
				href="https://www.strava.com/athletes/17003155"
				target="_blank"
				rel="noopener noreferrer"
				className="icon-button text-4xl mx-5"
				aria-label="strava"
			>
				<i className="fab fa-strava" />
			</a>
		</footer>
	);
};
