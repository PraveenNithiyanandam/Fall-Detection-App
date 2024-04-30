import React from 'react';
import { TextInput } from 'react-native';
import { darkGreen } from './Constants';

const Field = ({ placeholder, ...props }) => {
  const placeholderStyle = placeholder === 'Email / Username' ? { fontSize: 18 } : {};

  return (
    <TextInput
      {...props}
      style={{
        borderRadius: 5,
        color: darkGreen,
        paddingHorizontal: 20,
        width: '78%', // Adjusted to take full width
        backgroundColor: 'rgb(220, 220, 220)',
        marginVertical: 10,
        fontSize: 18, // Default font size for non-placeholder text
        fontWeight: 'bold', // Adjust font weight if needed
        borderWidth: 1,
        borderColor: darkGreen,
        paddingVertical: 10, // Adjust vertical padding for better appearance
        textAlign: 'center', // Center the placeholder text
        ...placeholderStyle, // Apply the custom placeholder style conditionally
      }}
      placeholderTextColor={'rgba(0, 0, 0, 0.3)'}
      placeholder={placeholder}
    />
  );
};

export default Field;
