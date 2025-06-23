// Third-party imports
import * as THREE from 'three';
import mapboxgl from 'mapbox-gl';

export const getMercatorMatrix = ({ lng, lat }: any, altitude: any) => {
	const merc = mapboxgl.MercatorCoordinate.fromLngLat({ lng, lat }, altitude);
	const scale = merc.meterInMercatorCoordinateUnits();
	
	const translation = new THREE.Matrix4().makeTranslation(merc.x, merc.y, merc.z);
	const rotationX = new THREE.Matrix4().makeRotationX(Math.PI / 2);
	const scaling = new THREE.Matrix4().makeScale(scale * 1000, scale * 1000, scale * 1000);
	
	const mercatorMatrix = new THREE.Matrix4()
		.multiply(translation)
		.multiply(rotationX)
		.multiply(scaling);
	
	return mercatorMatrix;
};

const meterInECEFUnits = (altitude: any) => {
  const EXTENT = 8192;
  const GLOBE_RADIUS = EXTENT / Math.PI / 2;
  const earthRadius = 63710088e-1;
  const radiusAtAlt = earthRadius + altitude;
  return GLOBE_RADIUS / radiusAtAlt;
};

const getRotation = (lng: any, lat: any) => {
	const phi = THREE.MathUtils.degToRad(lat);
	const lambda = THREE.MathUtils.degToRad(lng);

	const rotX = Math.PI / 2 - phi;
	const rotY = lambda + Math.PI;
	const rotZ = Math.PI;

	const rotationFromEuler = new THREE.Euler(rotX, rotY, rotZ, 'YXZ');
	return rotationFromEuler;
}

export const getEcefMatrix = ({ lng, lat }: any, altitude: any) => {
	const ecef = mapboxgl.LngLat.convert([lng, lat]).toEcef(altitude);
	const scale = meterInECEFUnits(altitude);
	const rotationFromEuler = getRotation(lng, lat);

	const translation = new THREE.Matrix4().makeTranslation(...ecef);
	const rotation = new THREE.Matrix4().makeRotationFromEuler(rotationFromEuler);
	const scaling = new THREE.Matrix4().makeScale(scale * 1000, scale * 1000, scale * 1000);

	const ecefMatrix = new THREE.Matrix4()
		.multiply(translation)
		.multiply(rotation)
		.multiply(scaling);

	return ecefMatrix;
}