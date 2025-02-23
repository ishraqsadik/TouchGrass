import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const ConnectionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const { auth } = useContext(AuthContext);

  // Example data
  const exampleUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Wilson" },
    { id: 4, name: "Alice Brown" },
  ];


  // Fetch connection requests on component mount
  useEffect(() => {
    
    if (auth.user.username) {
      fetchConnectionRequests();
    }
    console.log(connectionRequests);
  }, [auth]);


  const fetchConnectionRequests = async () => {
    try {
      const username = auth?.user?.username;
      const response = await axios.post(`/auth/user/requests`,{username});
      
      if (response?.data?.success) {
        const formattedRequests = response.data.requests?.map(request => ({
          id: request._id,
          name: request.name,
          username: request.username
        })) || [];
        setConnectionRequests(formattedRequests);
      }
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      setConnectionRequests([]); // Set empty array on error
    }
  };

  // Search users when search query changes
  useEffect(() => {
    if (searchQuery.length > 0) {
      // Simulate search with example data
      const filteredUsers = exampleUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  /* Commented out actual API calls for now
  const searchUsers = async () => {
    try {
      const response = await fetch(`/api/users/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await fetch("/api/connections/requests");
      const data = await response.json();
      setConnectionRequests(data);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
    }
  };
  */

  const handleAcceptRequest = async (senderUsername) => {
    try {
      const response = await axios.post('auth/connect/accept', {
        senderUsername,
        receiverUsername: auth.user.username,
      });

      if (response?.data?.success) {
        // Immediately remove the accepted request from the local state
        setConnectionRequests(prevRequests => 
          prevRequests.filter(request => request.username !== senderUsername)
        );
        // Then fetch the updated list from server
        await fetchConnectionRequests();
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  const handleDeclineRequest = async (senderUsername) => {
    try {
      const response = await axios.post('/auth/connect/reject', {
        senderUsername,
        receiverUsername: auth.user.username,
      });

      if (response?.data?.success) {
        // Immediately remove the declined request from the local state
        setConnectionRequests(prevRequests => 
          prevRequests.filter(request => request.username !== senderUsername)
        );
        // Then fetch the updated list from server
        await fetchConnectionRequests();
      }
    } catch (error) {
      console.error("Error rejecting connection request:", error);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderConnectionRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <View style={styles.requestButtons}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item.username)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton}
          onPress={() => handleDeclineRequest(item.username)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyRequestsComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No connection requests found</Text>
      <TouchableOpacity 
        style={styles.reloadButton}
        onPress={fetchConnectionRequests}
      >
        <Text style={styles.reloadButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Connect</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>

      <View style={styles.requestsSection}>
        <Text style={styles.sectionTitle}>Connection Requests</Text>
        <FlatList
          data={connectionRequests}
          renderItem={renderConnectionRequest}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={EmptyRequestsComponent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(241, 245, 249)", // slate-100
  },
  searchSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  requestsSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgb(71, 85, 105)", // slate-600
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 4,
  },
  searchInput: {
    height: 36,
    backgroundColor: "rgb(248, 250, 252)", // slate-50
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 8,
    color: "rgb(51, 65, 85)", // slate-700
  },
  list: {
    flex: 1,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "rgb(248, 250, 252)", // slate-50
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  requestCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "rgb(248, 250, 252)", // slate-50
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  userName: {
    fontSize: 14,

    color: "rgb(51, 65, 85)", // slate-700
    fontWeight: "400",
  },
  connectButton: {
    backgroundColor: "rgb(226, 232, 240)", // slate-200
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  connectButtonText: {
    color: "rgb(51, 65, 85)", // slate-700
    fontSize: 13,
    fontWeight: "500",
  },

  requestButtons: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "rgb(226, 232, 240)", // slate-200
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  declineButton: {
    backgroundColor: "rgb(226, 232, 240)", // slate-200
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: "rgb(51, 65, 85)", // slate-700
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "rgb(100, 116, 139)", // slate-500
    marginBottom: 12,
  },
  reloadButton: {
    backgroundColor: "rgb(226, 232, 240)", // slate-200
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  reloadButtonText: {
    color: "rgb(51, 65, 85)", // slate-700
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ConnectionsScreen;
