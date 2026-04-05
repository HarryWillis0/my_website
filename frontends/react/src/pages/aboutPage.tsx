import React from "react";

import { Footer } from "../components/footer";

export const AboutPage: React.FC = () => {
	return (
		<div className="flex flex-col" data-testid="about-page" aria-label="About Page">
			<div className="border-t border-gray-200 pt-6">
				<h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4 leading-snug">Hi, I'm Harry!</h1>
				<p className="text-sm text-gray-500 leading-relaxed mb-4">
					I am a full stack developer located in Calgary, AB. Outside of work I am usually outside, riding my
					bicycle, skateboard or skis.
				</p>
				<p className="text-sm text-gray-500 leading-relaxed">
					I would like to acknowledge that I currently reside in the traditional territories of the peoples of
					Treaty 7, which include the Blackfoot Confederacy (comprised of the Siksika, the Piikani, and the
					Kainai First Nations), the Tsuut'ina First Nation, and the Stoney Nakoda (including Chiniki,
					Bearspaw, and Goodstoney First Nations).
				</p>
			</div>
			<Footer />
		</div>
	);
};
