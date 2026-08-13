import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import SleepCard from '../components/SleepCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';

const HistoryScreen = ({ navigation }) => {
  const { records, removeRecord } = useContext(SleepContext);

  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this sleep record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeRecord(id) }
      ]
    );
  };

  const handlePressRecord = (record) => {
    Alert.alert(
      'Manage Record',
      'Choose an action for this sleep record.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(record.id) }
      ]
    );
  };

  if (sortedRecords.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState 
          icon="moon"
          title="No sleep records yet"
          message="Start tracking your sleep to see your history and insights."
          action={
            <PrimaryButton 
              title="Log Your First Sleep" 
              onPress={() => navigation.navigate('LogSleep')} 
            />
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRecords}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SleepCard 
            record={item} 
            onPress={() => handlePressRecord(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  }
});

export default HistoryScreen;
