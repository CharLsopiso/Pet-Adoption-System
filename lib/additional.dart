import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AdditionalPage extends StatefulWidget {
  final String adopterId;

  AdditionalPage({required this.adopterId});

  @override
  _AdditionalPageState createState() => _AdditionalPageState();
}

class _AdditionalPageState extends State<AdditionalPage> {
  Map<String, dynamic> _userData = {};
  bool _isLoading = true;
  String? _errorMessage;

  TextEditingController householdSizeController = TextEditingController();
  TextEditingController homeTypeController = TextEditingController();
  TextEditingController salaryController = TextEditingController();
  TextEditingController liveWithController = TextEditingController();
  TextEditingController availabilityToCareController = TextEditingController();
  TextEditingController petExperienceController = TextEditingController();
  TextEditingController otherPetsController = TextEditingController();

  @override
  void initState() {
    super.initState();
    additionalInfo();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreenAccent[100],
        title: Text('Additional Information'),
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
                        Text(
                          'Additional Information',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Household Size: ${_userData['household_size'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Home Type: ${_userData['home_type'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Salary: ${_userData['salary'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Live With: ${_userData['live_with'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Availability to Care: ${_userData['availability_to_care'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Pet Experiences: ${_userData['pet_experiences'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Other Pets: ${_userData['other_pets'] ?? 'N/A'}',
                          style: TextStyle(fontSize: 16),
                        ),
                        SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            _showEditAdditionalInfoModal();
                          },
                          child: Text('Edit Additional Info'),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  void _showEditAdditionalInfoModal() {
    householdSizeController.text = _userData['household_size']?.toString() ?? '';
    homeTypeController.text = _userData['home_type'] ?? '';
    salaryController.text = _userData['salary']?.toString() ?? '';
    liveWithController.text = _userData['live_with'] ?? '';
    availabilityToCareController.text = _userData['availability_to_care'] ?? '';
    petExperienceController.text = _userData['pet_experiences'] ?? '';
    otherPetsController.text = _userData['other_pets'] ?? '';

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Edit Additional Information'),
          content: SingleChildScrollView(
            child: Column(
              children: [
                _buildInputField(householdSizeController, 'Household Size', TextInputType.number),
                _buildInputField(homeTypeController, 'Home Type'),
                _buildInputField(salaryController, 'Salary', TextInputType.numberWithOptions(decimal: true)),
                _buildInputField(liveWithController, 'Live With'),
                _buildInputField(availabilityToCareController, 'Availability to Care'),
                _buildInputField(petExperienceController, 'Pet Experiences'),
                _buildInputField(otherPetsController, 'Other Pets'),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              style: TextButton.styleFrom(
                foregroundColor: Colors.grey,
              ),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                _saveAdditionalInfo();
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF00D084),
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

  void _saveAdditionalInfo() {
    setState(() {
      _userData['household_size'] = householdSizeController.text;
      _userData['home_type'] = homeTypeController.text;
      _userData['salary'] = salaryController.text;
      _userData['live_with'] = liveWithController.text;
      _userData['availability_to_care'] = availabilityToCareController.text;
      _userData['pet_experiences'] = petExperienceController.text;
      _userData['other_pets'] = otherPetsController.text;
    });

    _submitAddedInfo();
  }

  Future<void> additionalInfo() async {
    setState(() {
      _isLoading = true;
    });

    String url = "http://localhost/pet-adoption-api/main.php";

    final Map<String, dynamic> jsonData = {
      "adopterId": widget.adopterId,
    };

    final Map<String, dynamic> queryParams = {
      "operation": "getAdopterProfile",
      "json": jsonEncode(jsonData),
    };
    
    try {
      final response =
          await http.get(Uri.parse(url).replace(queryParameters: queryParams));
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      print(response);
      if (response.statusCode == 200) {
        final Map<String, dynamic> result = jsonDecode(response.body);

        if (result.containsKey('success') && result['success'] != null) {
          var user = result['success'];
          print(result);
          setState(() {
            _userData.addAll({
              'household_size': user['household_size'] ?? 'N/A',
              'home_type': user['home_type'] ?? 'N/A',
              'salary': user['salary'] ?? 'N/A',
              'live_with': user['live_with'] ?? 'N/A',
              'availability_to_care': user['availability_to_care'] ?? 'N/A',
              'pet_experiences': user['pet_experiences'] ?? 'N/A',
              'other_pets': user['other_pets'] ?? 'N/A',
            });
          });
        } else {
          setState(() {
            _errorMessage = result["error"] ??
                "Error fetching additional user data or user not found";
          });
        }
      }
    } catch (error) {
      setState(() {
        _errorMessage = "Error occurred: $error";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _submitAddedInfo() async {
    setState(() {
      _isLoading = true;
    });

    String url = "http://localhost/pet-adoption-api/main.php";

    final Map<String, dynamic> jsonData = {
      "adopterId": widget.adopterId,
      "householdSize": _userData['household_size'],
      "homeType": _userData['home_type'],
      "salary": _userData['salary'],
      "liveWith": _userData['live_with'],
      "availabilityToCare": _userData['availability_to_care'],
      "petExperiences": _userData['pet_experiences'],
      "otherPets": _userData['other_pets'],
    };

    final Map<String, dynamic> queryParams = {
      "operation": "updateProfile",
      "json": jsonEncode(jsonData),
    };

    try {
      final response =
          await http.get(Uri.parse(url).replace(queryParameters: queryParams));

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      if (response.statusCode == 200) {
        final result = jsonDecode(response.body);

        if (result.containsKey('success')) {
        } else {
          setState(() {
            _errorMessage = result["error"] ?? "Error updating user data";
          });
        }
      }
    } catch (error) {
      setState(() {
        _errorMessage = "Error occurred: $error";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}
