import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  sms?: string;
  website?: string;
  isEmergency: boolean;
}

const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    id: '1',
    name: 'Emergency Services',
    description: 'Call local emergency services for immediate help',
    phone: '911',
    isEmergency: true,
  },
  {
    id: '2',
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741 to connect with a Crisis Counselor',
    sms: '741741',
    website: 'https://www.crisistextline.org/',
    isEmergency: true,
  },
  {
    id: '3',
    name: 'National Suicide Prevention Lifeline',
    description: '24/7, free and confidential support for people in distress',
    phone: '1-800-273-8255',
    website: 'https://suicidepreventionlifeline.org/',
    isEmergency: true,
  },
  {
    id: '4',
    name: 'SAMHSA Treatment Referral Hotline',
    description: 'Substance Abuse and Mental Health Services Administration',
    phone: '1-800-662-4357',
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    isEmergency: false,
  },
  {
    id: '5',
    name: 'National Alliance on Mental Illness (NAMI)',
    description: 'Mental health organization dedicated to building better lives',
    phone: '1-800-950-6264',
    website: 'https://www.nami.org/',
    isEmergency: false,
  }
];

const SafetyButton: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleResourceAction = (resource: EmergencyResource) => {
    if (resource.phone) {
      handleCall(resource.phone, resource.name);
    } else if (resource.sms) {
      handleSMS(resource.sms);
    } else if (resource.website) {
      handleWebsite(resource.website);
    }
  };

  const handleCall = (phoneNumber: string, resourceName: string) => {
    Alert.alert(
      `Call ${resourceName}`,
      `Would you like to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
            setModalVisible(false);
          } 
        }
      ]
    );
  };

  const handleSMS = (smsNumber: string) => {
    Linking.openURL(`sms:${smsNumber}`);
    setModalVisible(false);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
    setModalVisible(false);
  };

  const renderResourceItem = (resource: EmergencyResource) => {
    return (
      <TouchableOpacity 
        key={resource.id}
        style={[
          styles.resourceItem, 
          resource.isEmergency && styles.emergencyResource
        ]}
        onPress={() => handleResourceAction(resource)}
      >
        <View style={styles.resourceHeader}>
          <Text style={[
            styles.resourceName,
            resource.isEmergency && styles.emergencyText
          ]}>
            {resource.name}
          </Text>
          {resource.phone && (
            <Ionicons 
              name="call" 
              size={18} 
              color={resource.isEmergency ? "#fff" : "#6A7BFF"} 
            />
          )}
          {resource.sms && (
            <Ionicons 
              name="chatbubble-ellipses" 
              size={18} 
              color={resource.isEmergency ? "#fff" : "#6A7BFF"} 
            />
          )}
        </View>
        <Text style={[
          styles.resourceDescription,
          resource.isEmergency && styles.emergencyText
        ]}>
          {resource.description}
        </Text>
        {resource.phone && (
          <Text style={[
            styles.resourceContact,
            resource.isEmergency && styles.emergencyText
          ]}>
            {resource.phone}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.safetyButton}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Safety resources"
        accessibilityHint="Opens a list of emergency and support resources"
      >
        <Ionicons name="shield" size={22} color="#E34A46" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.modalContent,
                { paddingBottom: insets.bottom + 20 }
              ]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Safety Resources</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDescription}>
                  If you're experiencing a mental health emergency or feel unsafe, 
                  please use one of these resources to get immediate help.
                </Text>

                <ScrollView style={styles.resourcesList}>
                  <Text style={styles.resourcesSection}>Emergency Resources</Text>
                  {EMERGENCY_RESOURCES
                    .filter(r => r.isEmergency)
                    .map(renderResourceItem)}
                  
                  <Text style={styles.resourcesSection}>Support Resources</Text>
                  {EMERGENCY_RESOURCES
                    .filter(r => !r.isEmergency)
                    .map(renderResourceItem)}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safetyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD7D7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 16,
  },
  resourcesList: {
    flex: 1,
  },
  resourcesSection: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    marginTop: 12,
    marginBottom: 8,
  },
  resourceItem: {
    backgroundColor: '#F7F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6A7BFF',
  },
  emergencyResource: {
    backgroundColor: '#E34A46',
    borderLeftColor: '#C43E3A',
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resourceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  resourceContact: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6A7BFF',
  },
  emergencyText: {
    color: '#fff',
  },
});

export default SafetyButton;