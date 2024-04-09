import React from "react";

import { Footer } from "../components/footer";

export const AboutPage: React.FC = (props) => {
    return (
        <div className="flex flex-col w-3/4">
            <p className="text-3xl mb-5">Hi, I'm Harry!</p>
            <p className="text-1xl mb-5">
                I am a full stack developer located in Calgary, AB. Outside of work
                I am usually outside, riding my bicycle, skateboard or skis.
            </p>
            <p className="text-1xl mb-5">
                I would like to acknowledge that I currently reside in the
                traditional territories of the peoples of Treaty 7, which
                include the Blackfoot Confederacy (comprised of the Siksika, the
                Piikani, and the Kainai First Nations), the Tsuut’ina First
                Nation, and the Stoney Nakoda (including Chiniki, Bearspaw, and
                Goodstoney First Nations).
            </p>
            <Footer />
        </div>
    );
};
