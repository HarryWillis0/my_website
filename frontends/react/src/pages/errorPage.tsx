import React from "react";

export const ErrorPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center mt">
			<p className="text-3xl mb-5">Oops!</p>
			<p>Something went wrong</p>
		</div>
	);
};
