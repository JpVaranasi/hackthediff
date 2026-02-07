
"use client";

import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { clubs, type Club } from "@/lib/clubs";

type Marker = {
	id: string;
	coordinates: [number, number]; // [lng, lat]
	popup?: string;
};

interface MapViewProps {
	center?: [number, number];
	zoom?: number;
	markers?: Marker[];
	style?: React.CSSProperties;
	showLiveLocation?: boolean;
	trackLocation?: boolean;
	showClubs?: boolean;
}

export default function MapView({
	center = [-3.1791, 51.4816],
	zoom = 12,
	markers = [],
	style,
	showLiveLocation = true,
	trackLocation = true,
	showClubs = true,
}: MapViewProps) {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<any | null>(null);
	const userMarkerRef = useRef<any | null>(null);
	const watchIdRef = useRef<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);
	const hasInitializedRef = useRef(false);

	useEffect(() => {
		const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
		if (!token) {
			setError("NEXT_PUBLIC_MAPBOX_TOKEN not set");
			setLoading(false);
			return;
		}

		if (hasInitializedRef.current || !mapContainer.current) return;
		hasInitializedRef.current = true;

		let isMounted = true;
		(async () => {
			try {
				const mapbox = (await import("mapbox-gl")).default;
				if (!isMounted || mapRef.current || !mapContainer.current) return;

				mapbox.accessToken = token;
				console.log("Initializing Mapbox with token:", token.slice(0, 10) + "...");

				mapRef.current = new mapbox.Map({
					container: mapContainer.current,
					style: "mapbox://styles/mapbox/streets-v11",
					center,
					zoom,
				});

				mapRef.current.once("load", () => {
					console.log("Map loaded successfully");
					setLoading(false);

					// Request user location after map loads
					if (showLiveLocation && isMounted) {
						requestUserLocation(mapbox);
					}
				});

				mapRef.current.on("error", (e: any) => {
					console.error("Mapbox error:", e);
					setError("Map initialization failed: " + e.message);
					setLoading(false);
				});

				mapRef.current.addControl(new mapbox.NavigationControl(), "top-right");

				// Add club markers
				if (showClubs) {
					clubs.forEach((club: Club) => {
						const popupContent = `
							<div style="padding: 8px; font-size: 12px;">
								<strong style="font-size: 14px;">${club.name}</strong>
								<div style="margin-top: 6px; color: #666;">
									<div><strong>Tags:</strong> ${club.tags.join(", ")}</div>
									<div style="margin-top: 4px;"><strong>Training Days:</strong> ${club.training_days.join(", ")}</div>
								</div>
							</div>
						`;
						const el = document.createElement("div");
						el.style.width = "32px";
						el.style.height = "40px";
						el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"><path fill="%23ef4444" d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>')`;
						el.style.backgroundSize = "contain";
						el.style.backgroundRepeat = "no-repeat";
						el.style.cursor = "pointer";

						const marker = new mapbox.Marker(el).setLngLat([club.long, club.lat]);
						marker.setPopup(
							new mapbox.Popup({ offset: 25 }).setHTML(popupContent)
						);
						marker.addTo(mapRef.current);
					});
				}

				markers.forEach((m: any) => {
					const marker = new mapbox.Marker().setLngLat(m.coordinates);
					if (m.popup) {
						marker.setPopup(new mapbox.Popup({ offset: 25 }).setText(m.popup));
					}
					marker.addTo(mapRef.current);
				});
			} catch (err: any) {
				console.error("Failed to load mapbox-gl:", err);
				setError("Failed to load map: " + err.message);
				setLoading(false);
			}
		})();

		return () => {
			isMounted = false;
			// Stop watching user location
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
			}
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	const requestUserLocation = async (mapbox: any) => {
		if (!navigator.geolocation) {
			setError("Geolocation not supported by your browser");
			return;
		}

		console.log("Requesting user location...");
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const userCoords = { lng: longitude, lat: latitude };
				setUserLocation(userCoords);
				console.log("User location:", userCoords);

				// Add user location marker
				if (mapRef.current && userMarkerRef.current === null) {
					const el = document.createElement("div");
					el.style.width = "30px";
					el.style.height = "30px";
					el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="%233b82f6" opacity="0.8"/><circle cx="15" cy="15" r="8" fill="white"/><circle cx="15" cy="15" r="4" fill="%233b82f6"/></svg>')`;
					el.style.backgroundSize = "contain";

					userMarkerRef.current = new mapbox.Marker(el)
						.setLngLat([longitude, latitude])
						.setPopup(new mapbox.Popup().setText("📍 You are here"))
						.addTo(mapRef.current);

					// Center map on user location
					mapRef.current.flyTo({
						center: [longitude, latitude],
						zoom: 14,
						duration: 1000,
					});
				}

				// Start tracking location if enabled
				if (trackLocation && watchIdRef.current === null) {
					watchIdRef.current = navigator.geolocation.watchPosition(
						(updatedPosition) => {
							const { latitude: lat, longitude: lng } = updatedPosition.coords;
							const newCoords = { lng, lat };
							setUserLocation(newCoords);
							console.log("Location updated:", newCoords);

							// Update marker position
							if (userMarkerRef.current && mapRef.current) {
								userMarkerRef.current.setLngLat([lng, lat]);
							}
						},
						(err) => {
							console.error("Geolocation error:", err);
							setError("Could not track location: " + err.message);
						},
						{ enableHighAccuracy: true, maximumAge: 0, timeout: 10000000000000000000000000000000000000000000000000000000000000000000000000000 }
					);
				}
			},
			(err) => {
				console.error("Geolocation error:", err);
				if (err.code === 1) {
					setError("Location permission denied. Enable it in browser settings.");
				} else {
					setError("Could not get location: " + err.message);
				}
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	};

	const recenterOnLocation = () => {
		if (userLocation && mapRef.current) {
			mapRef.current.flyTo({
				center: [userLocation.lng, userLocation.lat],
				zoom: 14,
				duration: 1000,
			});
		}
	};

	return (
		<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
			{error && (
				<div style={{ color: "#b91c1c", padding: "12px 16px", backgroundColor: "#fee2e2", fontSize: 14 }}>
					❌ {error}
				</div>
			)}
			{loading && (
				<div style={{ color: "#666", padding: "12px 16px", backgroundColor: "#f3f4f6", fontSize: 14 }}>
					⏳ Loading map...
				</div>
			)}
			<div style={{ position: "relative", flex: 1, width: "100%" }}>
				<div
					ref={mapContainer}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#e5e7eb",
					}}
				/>
				{showLiveLocation && userLocation && (
					<div style={{ position: "absolute", top: 10, right: 50, zIndex: 10 }}>
						<button
							onClick={recenterOnLocation}
							style={{
								padding: "8px 12px",
								backgroundColor: "#3b82f6",
								color: "white",
								border: "none",
								borderRadius: 4,
								cursor: "pointer",
								fontSize: 12,
								fontWeight: 500,
								boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
							}}
						>
							📍 Re-center 
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export type { Club };
