import React, { useState } from 'react';
import { doc, collection, getDoc, addDoc, updateDoc, increment } from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';
import { toast } from 'react-hot-toast';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ButtonGroup,
  Button,
  Alert,
  AlertIcon,
  Text
} from '@chakra-ui/react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventData: {
    registrationFields?: {
      required: string[];
      optional: string[];
    };
    registrationFee?: number;
    paymentInstructions?: string;
    upiId?: string;
    organizerPhone?: string;
    maxRegistrationsPerTeam?: number;
    minTeamSize?: number;
    maxTeamSize?: number;
  };
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, eventId, eventData }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    playerName: '',
    email: '',
    gameId: '',
    teamName: '',
    phoneNumber: '',
    discordId: '',
    upiTransactionId: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Validate required fields from event configuration
    if (eventData.registrationFields?.required) {
      eventData.registrationFields.required.forEach(field => {
        if (!formData[field as keyof RegistrationFormData]) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      });
    }

    // Additional validation rules
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Team size validation if applicable
    if (eventData.minTeamSize && eventData.maxTeamSize) {
      const teamMembers = formData.teamMembers?.length || 1;
      if (teamMembers < eventData.minTeamSize) {
        errors.teamMembers = `Team must have at least ${eventData.minTeamSize} members`;
      }
      if (teamMembers > eventData.maxTeamSize) {
        errors.teamMembers = `Team cannot have more than ${eventData.maxTeamSize} members`;
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      const registrationsRef = collection(eventRef, 'registrations');
      const infoDocRef = doc(registrationsRef, '_info');

      // Get current registration count
      const infoDoc = await getDoc(infoDocRef);
      const currentCount = infoDoc.data()?.totalRegistrations || 0;

      // Create registration document
      const registrationData = {
        ...formData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        registrationNumber: currentCount + 1
      };

      // Add registration document
      await addDoc(registrationsRef, registrationData);

      // Update registration count
      await updateDoc(infoDocRef, {
        totalRegistrations: increment(1),
        lastUpdated: new Date()
      });

      // Update event document
      await updateDoc(eventRef, {
        registrationsCount: increment(1)
      });

      onClose();
      toast({
        title: 'Registration Successful',
        description: 'Your registration has been submitted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: 'Registration Failed',
        description: 'There was an error submitting your registration. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event Registration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {/* Required Fields */}
              {eventData.registrationFields?.required.map((field) => (
                <FormControl key={field} isRequired isInvalid={!!formErrors[field]}>
                  <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                  <Input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field as keyof RegistrationFormData] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                  <FormErrorMessage>{formErrors[field]}</FormErrorMessage>
                </FormControl>
              ))}

              {/* Optional Fields */}
              {eventData.registrationFields?.optional.map((field) => (
                <FormControl key={field} isInvalid={!!formErrors[field]}>
                  <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                  <Input
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field as keyof RegistrationFormData] || ''}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                  <FormErrorMessage>{formErrors[field]}</FormErrorMessage>
                </FormControl>
              ))}

              {/* Payment Information */}
              {eventData.registrationFee && eventData.registrationFee > 0 && (
                <>
                  <Alert status="info">
                    <AlertIcon />
                    <VStack align="start" spacing={2}>
                      <Text>Registration Fee: ₹{eventData.registrationFee}</Text>
                      {eventData.paymentInstructions && (
                        <Text>{eventData.paymentInstructions}</Text>
                      )}
                      {eventData.upiId && (
                        <Text>UPI ID: {eventData.upiId}</Text>
                      )}
                      {eventData.organizerPhone && (
                        <Text>Organizer Phone: {eventData.organizerPhone}</Text>
                      )}
                    </VStack>
                  </Alert>
                  <FormControl isRequired isInvalid={!!formErrors.upiTransactionId}>
                    <FormLabel>UPI Transaction ID</FormLabel>
                    <Input
                      value={formData.upiTransactionId}
                      onChange={(e) => setFormData({ ...formData, upiTransactionId: e.target.value })}
                      placeholder="Enter your UPI transaction ID"
                    />
                    <FormErrorMessage>{formErrors.upiTransactionId}</FormErrorMessage>
                  </FormControl>
                </>
              )}
            </VStack>

            <ButtonGroup mt={4} spacing={4} width="100%">
              <Button onClick={onClose} width="50%">Cancel</Button>
              <Button
                type="submit"
                colorScheme="blue"
                width="50%"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 