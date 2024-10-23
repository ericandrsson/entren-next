import EXIF from "exif-js";

interface GPSCoordinates {
  lat: string | null;
  lng: string | null;
}

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string): number {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

export async function getGPSCoordinates(file: File): Promise<GPSCoordinates> {
  return new Promise((resolve) => {
    EXIF.getData(file as any, function (this: any) {
      const exifData = EXIF.getAllTags(this);

      if (exifData.GPSLatitude && exifData.GPSLongitude) {
        const latDegrees = exifData.GPSLatitude[0].numerator / exifData.GPSLatitude[0].denominator;
        const latMinutes = exifData.GPSLatitude[1].numerator / exifData.GPSLatitude[1].denominator;
        const latSeconds = exifData.GPSLatitude[2].numerator / exifData.GPSLatitude[2].denominator;
        const latDirection = exifData.GPSLatitudeRef;

        const lngDegrees = exifData.GPSLongitude[0].numerator / exifData.GPSLongitude[0].denominator;
        const lngMinutes = exifData.GPSLongitude[1].numerator / exifData.GPSLongitude[1].denominator;
        const lngSeconds = exifData.GPSLongitude[2].numerator / exifData.GPSLongitude[2].denominator;
        const lngDirection = exifData.GPSLongitudeRef;

        const lat = convertDMSToDD(latDegrees, latMinutes, latSeconds, latDirection);
        const lng = convertDMSToDD(lngDegrees, lngMinutes, lngSeconds, lngDirection);

        resolve({ lat: lat.toString(), lng: lng.toString() });
      } else {
        resolve({ lat: null, lng: null });
      }
    });
  });
}
