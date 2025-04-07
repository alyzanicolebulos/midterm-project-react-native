import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Props } from "../navigation/props";

interface Job {
  id: string;
  title: string;
  companyName: string;
  mainCategory: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
}

const SavedJobsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { savedJobs = [], setSavedJobs = () => {} } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whyHire, setWhyHire] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHire: '',
  });

  const { colors } = useTheme();

  const handleApplyPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
    setFeedbackMessage('');
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    let formErrors = { name: '', email: '', contactNumber: '', whyHire: '' };

    if (!name.trim()) {
      formErrors.name = 'Name is required';
      formIsValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      formErrors.email = 'Email is required';
      formIsValid = false;
    } else if (!emailPattern.test(email)) {
      formErrors.email = 'Invalid email format';
      formIsValid = false;
    }

    const phonePattern = /^09\d{9}$/;
    if (!contactNumber.trim()) {
      formErrors.contactNumber = 'Contact number is required';
      formIsValid = false;
    } else if (!phonePattern.test(contactNumber)) {
      formErrors.contactNumber = 'Invalid phone number (09XXXXXXXXX)';
      formIsValid = false;
    }

    if (!whyHire.trim()) {
      formErrors.whyHire = 'This field is required';
      formIsValid = false;
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSubmitApplication = () => {
    if (validateForm()) {
      setFeedbackMessage('Application submitted successfully!');
      
      // Reset form
      setName('');
      setEmail('');
      setContactNumber('');
      setWhyHire('');
      setErrors({
        name: '',
        email: '',
        contactNumber: '',
        whyHire: '',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setName('');
    setEmail('');
    setContactNumber('');
    setWhyHire('');
    setFeedbackMessage('');
    setErrors({
      name: '',
      email: '',
      contactNumber: '',
      whyHire: '',
    });
  };

  const handleRemoveJob = (job: Job) => {
    setSelectedJob(job);
    setConfirmRemoveVisible(true);
  };

  const confirmRemove = () => {
    if (selectedJob) {
      const updatedSavedJobs = savedJobs.filter(job => job.id !== selectedJob.id);
      setSavedJobs(updatedSavedJobs);
      navigation.setParams({
        savedJobs: updatedSavedJobs,
        setSavedJobs: setSavedJobs
      });
      setConfirmRemoveVisible(false);
      setSelectedJob(null);
    }
  };

  const cancelRemove = () => {
    setConfirmRemoveVisible(false);
    setSelectedJob(null);
  };

  const renderSavedJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.jobCompany, { color: colors.primary }]}>{item.companyName}</Text>
      
      <View style={styles.jobActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surface }]}
          onPress={() => handleRemoveJob(item)}
        >
          <Icon name="delete-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => handleApplyPress(item)}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="bookmark-outline" size={48} color={colors.placeholder} />
          <Text style={[styles.emptyText, { color: colors.placeholder }]}>No saved jobs yet</Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          renderItem={renderSavedJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Application Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {selectedJob && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Apply for {selectedJob.title}
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.text }]}>
                  at {selectedJob.companyName}
                </Text>

                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Full Name"
                  placeholderTextColor={colors.placeholder}
                  value={name}
                  onChangeText={setName}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Email"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Contact Number"
                  placeholderTextColor={colors.placeholder}
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                />
                {errors.contactNumber ? <Text style={styles.errorText}>{errors.contactNumber}</Text> : null}

                <TextInput
                  style={[styles.input, styles.textArea, { 
                    backgroundColor: colors.background, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Why should we hire you?"
                  placeholderTextColor={colors.placeholder}
                  value={whyHire}
                  onChangeText={setWhyHire}
                  multiline
                  numberOfLines={4}
                />
                {errors.whyHire ? <Text style={styles.errorText}>{errors.whyHire}</Text> : null}

                {feedbackMessage ? (
                  <Text style={[styles.feedbackMessage, { color: colors.primary }]}>
                    {feedbackMessage}
                  </Text>
                ) : null}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.error }]}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleSubmitApplication}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={confirmRemoveVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelRemove}
      >
        <View style={[styles.confirmModalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.confirmModalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.confirmModalText, { color: colors.text }]}>
              Remove this job from saved?
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: colors.error }]}
                onPress={cancelRemove}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={confirmRemove}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    marginBottom: 12,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
  },
  feedbackMessage: {
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
});

export default SavedJobsScreen;