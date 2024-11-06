import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'additional.dart';

class ProfilePage extends StatefulWidget {
  final String adopterId;

  ProfilePage({required this.adopterId});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic> _userData = {};
  bool _isLoading = true;
  String? _errorMessage;

  // Controllers for form fields
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController contactNumberController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController addressController = TextEditingController();
  TextEditingController usernameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    userInfo();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreenAccent[100],
        title: Text('Profile'),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildBasicInfo(),
                        SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _showEditBasicInfoModal,
                          child: Text('Edit Basic Info'),
                        ),
                        SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => AdditionalPage(
                                      adopterId: widget.adopterId)),
                            );
                          },
                          child: Text('Additional Info'),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildBasicInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Basic Information',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        _buildInfoRow('First Name', _userData['first_name']),
        _buildInfoRow('Last Name', _userData['last_name']),
        _buildInfoRow('Contact Number', _userData['contact_number']),
        _buildInfoRow('Email', _userData['email']),
        _buildInfoRow('Address', _userData['address']),
        _buildInfoRow('Username', _userData['username']),
      ],
    );
  }

  Widget _buildInfoRow(String label, String? value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600, // Slightly bold label
            color: Colors.black, // Label color
          ),
        ),
        SizedBox(height: 6), // Space between label and value
        Container(
          padding: const EdgeInsets.symmetric(
              vertical: 8.0,
              horizontal: 10.0), // Padding for text inside the box
          decoration: BoxDecoration(
            color: Colors.white, // Light background color for text
            borderRadius: BorderRadius.circular(8), // Rounded edges
          ),
          child: Text(
            value ?? 'N/A',
            style: TextStyle(
              fontSize: 16,
              color: Colors.black87, // Text color for value
            ),
          ),
        ),
        SizedBox(height: 12), // Space between each row
      ],
    );
  }

  void _showEditBasicInfoModal() {
    firstNameController.text = _userData['first_name'] ?? '';
    lastNameController.text = _userData['last_name'] ?? '';
    contactNumberController.text = _userData['contact_number'] ?? '';
    emailController.text = _userData['email'] ?? '';
    addressController.text = _userData['address'] ?? '';
    usernameController.text = _userData['username'] ?? '';

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Edit Basic Information'),
          content: SingleChildScrollView(
            child: Column(
              children: [
                _buildInputField(firstNameController, 'First Name'),
                _buildInputField(lastNameController, 'Last Name'),
                _buildInputField(contactNumberController, 'Contact Number'),
                _buildInputField(emailController, 'Email'),
                _buildInputField(addressController, 'Address'),
                _buildInputField(usernameController, 'Username'),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              style: TextButton.styleFrom(
                foregroundColor: Colors.grey, // Text color for 'Cancel'
              ),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                _saveBasicInfo();
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF00D084), // Button background color
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text('Save'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildInputField(TextEditingController controller, String hintText,
      [TextInputType keyboardType = TextInputType.text]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
        ),
        child: TextField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hintText,
            border: InputBorder.none,
            contentPadding: EdgeInsets.symmetric(horizontal: 16),
          ),
        ),
      ),
    );
  }

  Future<void> userInfo() async {
  String url = "http://localhost/pet-adoption-api/main.php";

  final Map<String, dynamic> jsonData = {
    "adopterId": widget.adopterId,
  };

  final Map<String, dynamic> queryParams = {
    "operation": "getAdopterBasicInfo",
    "json": jsonEncode(jsonData),
  };

  try {
    final response =
        await http.get(Uri.parse(url).replace(queryParameters: queryParams));

    if (response.statusCode == 200) {
      final Map<String, dynamic> result = jsonDecode(response.body);

      // Check if the result contains a "success" key and it's a Map, not a List
      if (result.containsKey('success') && result['success'] is Map) {
        var user = result['success'];
        setState(() {
          _userData = {
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'contact_number': user['contact_number'],
            'address': user['address'],
            'username': user['username'],
            'email': user['email'] ?? '',
          };
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = result["error"] ?? "Error fetching user data";
          _isLoading = false;
        });
      }
    } else {
      setState(() {
        _errorMessage = "Failed to load data from server";
        _isLoading = false;
      });
    }
  } catch (error) {
    setState(() {
      _errorMessage = "Error occurred: $error";
      _isLoading = false;
    });
  }
}


  void _saveBasicInfo() {
    setState(() {
      _userData['first_name'] = firstNameController.text;
      _userData['last_name'] = lastNameController.text;
      _userData['contact_number'] = contactNumberController.text;
      _userData['email'] = emailController.text;
      _userData['address'] = addressController.text;
      _userData['username'] = usernameController.text;
    });

    // Optionally: call the API to save this data
  }
}
