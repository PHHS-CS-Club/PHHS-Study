import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NavigateTo(props) {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(props.link);
	}, [props.link, navigate]);
}
