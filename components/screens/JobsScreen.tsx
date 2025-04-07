import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Text, Modal } from 'react-native';
import uuid from 'react-native-uuid';
import { Props } from '../navigation/props';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Job {
  id: string;
  title: string;
  companyName: string;
  mainCategory: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
}

const JobsScreen: React.FC<Props> = ({ navigation, toggleTheme, isDarkMode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [whyHire, setWhyHire] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHire: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const data = await response.json();

      if (data && data.jobs) {
        const jobsWithIds: Job[] = data.jobs.map((job: Job) => ({
          ...job,
          id: uuid.v4(),
        }));

        setJobs(jobsWithIds);
        setFilteredJobs(jobsWithIds);
      } else {
        Alert.alert('Error', 'No jobs found in the response.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = (term: string) => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(term.toLowerCase()) ||
      job.companyName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    filterJobs(text);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = (job: Job) => {
    setSavedJobs((prevSavedJobs) => {
      const jobIndex = prevSavedJobs.findIndex(savedJob => savedJob.id === job.id);
      if (jobIndex >= 0) {
        const updatedSavedJobs = [...prevSavedJobs];
        updatedSavedJobs.splice(jobIndex, 1);
        return updatedSavedJobs;
      } else {
        return [...prevSavedJobs, job];
      }
    });
  };

  const handleApplyPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
    setFeedbackMessage('');
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    let formErrors = { name: '', email: '', contactNumber: '', whyHire: '' };

    if (!name.trim()) {
      formErrors.name = 'Name is required.';
      formIsValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      formErrors.email = 'Email is required.';
      formIsValid = false;
    } else if (!emailPattern.test(email)) {
      formErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    const contactNumberPattern = /^09\d{9}$/;
    if (!contactNumber.trim()) {
      formErrors.contactNumber = 'Contact number is required.';
      formIsValid = false;
    } else if (!contactNumberPattern.test(contactNumber)) {
      formErrors.contactNumber = 'Please enter a valid contact number (11 digits starting with 09).';
      formIsValid = false;
    }

    if (!whyHire.trim()) {
      formErrors.whyHire = 'This field is required.';
      formIsValid = false;
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSubmitApplication = () => {
    if (validateForm()) {
      setFeedbackMessage('Application submitted successfully!');
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
    setErrors({
      name: '',
      email: '',
      contactNumber: '',
      whyHire: '',
    });
    setFeedbackMessage('');
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobCard, { backgroundColor: colors.surface }]}>
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleSaveJob(item)}>
          <Icon 
            name={savedJobs.some(savedJob => savedJob.id === item.id) ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.jobCompany, { color: colors.primary }]}>{item.companyName}</Text>
      
      <View style={styles.jobMeta}>
        <Text style={[styles.metaText, { color: colors.placeholder }]}>{item.mainCategory}</Text>
        <Text style={[styles.metaText, { color: colors.placeholder }]}>{item.jobType}</Text>
      </View>

      <TouchableOpacity
        style={[styles.applyButton, { backgroundColor: colors.primary }]}
        onPress={() => handleApplyPress(item)}
      >
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: colors.surface, 
            color: colors.text,
            borderColor: colors.placeholder
          }]}
          placeholder="Search jobs..."
          placeholderTextColor={colors.placeholder}
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Saved Jobs', { savedJobs, setSavedJobs })}>
            <Icon name="bookmark-multiple" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Icon name={isDarkMode ? "weather-sunny" : "weather-night"} size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          {selectedJob && (
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Apply for {selectedJob.title}</Text>
                <Text style={[styles.modalSubtitle, { color: colors.text }]}>at {selectedJob.companyName}</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.placeholder}
                  value={name}
                  onChangeText={setName}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Contact Number</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Enter your contact number"
                  placeholderTextColor={colors.placeholder}
                  value={contactNumber}
                  onChangeText={setContactNumber}
                />
                {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Why should we hire you?</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.placeholder
                  }]}
                  placeholder="Why should we hire you?"
                  placeholderTextColor={colors.placeholder}
                  value={whyHire}
                  onChangeText={setWhyHire}
                />
                {errors.whyHire && <Text style={styles.errorText}>{errors.whyHire}</Text>}
              </View>

              <Text style={[styles.feedbackMessage, { color: colors.primary }]}>
                {feedbackMessage}
              </Text>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitApplication}
              >
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginLeft: 12,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  jobCompany: {
    fontSize: 14,
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  metaText: {
    fontSize: 12,
  },
  applyButton: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 16,
  },
  loader: {
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#777',
  },
  formGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  feedbackMessage: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobsScreen;