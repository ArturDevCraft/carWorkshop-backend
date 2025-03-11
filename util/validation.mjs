export function isValidText(value, minLength = 1) {
	return value && value.trim().length >= minLength;
}

export function isValidEmail(value) {
	return value && value.includes('@') && value.includes('.');
}

export function isEqualToOtherValue(value, otherValue) {
	return value === otherValue;
}
