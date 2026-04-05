import React from "react";

import { Shell } from "../components/shell";

export const ErrorPage: React.FC = () => {
	return (
		<Shell>
			<div className="border-t border-gray-200 pt-6">
				<h1 className="font-serif text-3xl font-semibold text-gray-900 mb-4 leading-snug">
					Something has gone wrong
				</h1>
				<p className="text-sm text-gray-500 leading-relaxed">Please try again.</p>
			</div>
		</Shell>
	);
};
