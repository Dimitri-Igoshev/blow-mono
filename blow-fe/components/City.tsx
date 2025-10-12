"use client";

import { useCityLabel } from "@/helper/getCityString";
import React from "react";

function City({ cityValue }: any) {
	const { getCityLabel } = useCityLabel();

	return <p>{getCityLabel(cityValue)}</p>;
}

export default City;
