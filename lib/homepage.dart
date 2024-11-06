import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'login.dart';
import 'profile.dart';
import 'notif.dart';
import 'adopt.dart';

class HomePage extends StatefulWidget {
  final String adopterId;
  final String userFirstName;
  final String userLastName;

  HomePage({
    required this.adopterId,
    required this.userFirstName,
    required this.userLastName,
  });

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<dynamic> _pets = [];
  List<dynamic> _petTypes = [];
  bool _isLoading = true;
  String? _errorMessage;
  String? _selectedPetType;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchPets();
    fetchPetTypes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.lightGreenAccent[100],
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Image.asset(
              'assets/LOGO_PET_2-removebg-preview.png',
              height: 40,
            ),
            Text(
              'Pet Adoption',
              style: TextStyle(color: Colors.black),
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => NotificationPage()),
                );
              },
              child: Icon(Icons.notifications, color: Colors.blueAccent),
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              'Welcome, ${widget.userFirstName} ${widget.userLastName}!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Row(
              children: [
                Text('Filter by Pet Type: '),
                SizedBox(width: 8),
                DropdownButton<String>(
                  value: _selectedPetType,
                  hint: Text('Select Pet Type'),
                  items: _petTypes.map<DropdownMenuItem<String>>((petType) {
                    return DropdownMenuItem<String>(
                      value: petType['pet_type_id'].toString(),
                      child: Text(petType['pet_type_name']),
                    );
                  }).toList()
                    ..insert(
                      0,
                      DropdownMenuItem<String>(
                        value: 'All',
                        child: Text('All'),
                      ),
                    ),
                  onChanged: (newValue) {
                    setState(() {
                      _selectedPetType = newValue == 'All' ? null : newValue;
                      _fetchPets();
                    });
                  },
                ),
              ],
            ),
            SizedBox(height: 8),
            if (_isLoading)
              Center(child: CircularProgressIndicator())
            else if (_errorMessage != null)
              Text(_errorMessage!, style: TextStyle(color: Colors.red))
            else
              Expanded(
                child: GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: MediaQuery.of(context).size.width > 1200
                        ? 4
                        : MediaQuery.of(context).size.width > 800
                            ? 3
                            : MediaQuery.of(context).size.width > 600
                                ? 2
                                : 2,
                    crossAxisSpacing: 16.0,
                    mainAxisSpacing: 16.0,
                    childAspectRatio: 0.6,
                  ),
                  itemCount: _pets.length,
                  itemBuilder: (context, index) {
                    return AnimalAdoptCard(
                      pet: _pets[index],
                      adopterId: widget.adopterId,
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pets),
            label: 'Adopt',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.exit_to_app),
            label: 'Logout',
          ),
        ],
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0: // Home
        // Stay on the current page
        break;
      case 1: // Adopt
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => AdoptPage()),
        );
        break;
      case 2: // Profile
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProfilePage(adopterId: widget.adopterId),
          ),
        );
        break;
      case 3: // Logout
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
        break;
    }
  }

  Future<void> _fetchPets() async {
    String url = "http://localhost/pet-adoption-api/main.php";

    final Map<String, dynamic> queryParams = {
      "operation": "filterAvailablePets",
    };

    if (_selectedPetType != null) {
      queryParams["json"] = jsonEncode({"petType": _selectedPetType});
    } else {
      queryParams["json"] = jsonEncode({});
    }

    try {
      final response =
          await http.get(Uri.parse(url).replace(queryParameters: queryParams));

      if (response.statusCode == 200) {
        setState(() {
          // print(response.body);
          _pets = jsonDecode(response.body)['success'] ?? [];
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage =
              'Failed to load pets, status code: ${response.statusCode}';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'An error occurred: $e';
        _isLoading = false;
      });
    }
  }

  // Future<void> _fetchPets() async {
  //   String url = "http://localhost/pet-adoption-api/main.php";

  //   final Map<String, dynamic> jsonData = {
  //     "pet_type_id": widget.pet_type_id,
  //   };

  //   final Map<String, dynamic> queryParams = {
  //     "operation": "getPets",
  //     "json": jsonEncode({"petType": _selectedPetType}),
  //   };

  //   try {
  //     final response =
  //         await http.get(Uri.parse(url).replace(queryParameters: queryParams));

  //     if (response.statusCode == 200) {
  //       setState(() {
  //         _pets = jsonDecode(response.body)['success'] ?? [];
  //         _isLoading = false;
  //       });
  //     } else {
  //       setState(() {
  //         _errorMessage =
  //             'Failed to load pets, status code: ${response.statusCode}';
  //         _isLoading = false;
  //       });
  //     }
  //   } catch (e) {
  //     setState(() {
  //       _errorMessage = 'An error occurred: $e';
  //       _isLoading = false;
  //     });
  //   }
  // }

  Future<void> fetchPetTypes() async {
    String url = "http://localhost/pet-adoption-api/main.php";

    final Map<String, dynamic> queryParams = {
      "operation": "getPetTypes",
      "json": "",
    };

    try {
      http.Response response =
          await http.get(Uri.parse(url).replace(queryParameters: queryParams));

      if (response.statusCode == 200) {
        setState(() {
          _petTypes = jsonDecode(response.body)['success'] ?? [];
        });
      } else {
        print('Failed to load pet types, status code: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (error) {
      print('An error occurred: $error');
    }
  }
}

class AnimalAdoptCard extends StatelessWidget {
  final dynamic pet;
  final String adopterId;

  AnimalAdoptCard({
    required this.pet,
    required this.adopterId,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double cardWidth = screenWidth * 0.5;
    double imageHeight = MediaQuery.of(context).size.height * 0.29;

    return Card(
      elevation: 4.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                height: imageHeight,
                width: cardWidth * 0.9,
                decoration: BoxDecoration(
                  color: Colors.purple[100],
                  borderRadius: BorderRadius.circular(12.0),
                  image: pet['pet_image'] != null && pet['pet_image'] != ''
                      ? DecorationImage(
                          image: NetworkImage(
                            'http://192.168.1.13/pet-adoption-api/upload/${pet['pet_image']}',
                          ),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: pet['pet_image'] == null || pet['pet_image'] == ''
                    ? Center(
                        child: Icon(Icons.pets, size: 80, color: Colors.grey),
                      )
                    : null,
              ),
            ),
            SizedBox(height: 8.0),
            Center(
              child: Text(
                pet['pet_name'] ?? 'Unknown Pet',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: screenWidth * 0.03,
                ),
              ),
            ),
            SizedBox(height: 4.0),
            Center(
              child: Text(
                pet['pet_type_name'] ?? 'Unknown Type',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: screenWidth * 0.02,
                ),
              ),
            ),
            SizedBox(height: 8.0),
            Center(
              child: Text(
                'Age: ${pet['age'] ?? 'N/A'}',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: screenWidth * 0.02,
                ),
              ),
            ),
            SizedBox(height: 4.0),
            Center(
              child: Text(
                'Gender: ${pet['gender'] ?? 'N/A'}',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: screenWidth * 0.02,
                ),
              ),
            ),
            SizedBox(height: 8.0),
            Center(
              child: Text(
                pet['description'] ?? 'No description available',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: screenWidth * 0.02,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(height: 8.0),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  _showInterestModal(context);
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Show Interest',
                      style: TextStyle(fontSize: screenWidth * 0.03),
                    ),
                    Icon(Icons.favorite, color: Colors.red),
                    SizedBox(width: 8),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showInterestModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      isScrollControlled: true,
      builder: (BuildContext context) {
        return FractionallySizedBox(
          heightFactor: 0.9,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Text(
                    pet['pet_name'] ?? 'Unknown Pet',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                    ),
                  ),
                ),
                SizedBox(height: 16),
                Center(
                  child: Container(
                    height: 200,
                    width: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: pet['pet_image'] != null && pet['pet_image'] != ''
                          ? DecorationImage(
                              image: NetworkImage(
                                'http://192.168.1.13/pet-adoption-api/upload/${pet['pet_image']}',
                              ),
                              fit: BoxFit.cover,
                            )
                          : null,
                    ),
                  ),
                ),
                SizedBox(height: 16),
                Text('Type: ${pet['pet_type_name'] ?? 'N/A'}'),
                Text('Breed: ${pet['breed_id'] ?? 'N/A'}'),
                Text('Description: ${pet['description'] ?? 'N/A'}'),
                Text('Age: ${pet['age'] ?? 'N/A'}'),
                Text('Gender: ${pet['gender'] ?? 'N/A'}'),
                Text('Adoption Fee: ${pet['adoption_fee'] ?? 'N/A'}'),
                Spacer(),
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      _checkProfileAndSubmit(context);
                    },
                    child: Text('Adopt Now'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showSnackBar(BuildContext context, String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
      ),
    );
  }

  void _checkProfileAndSubmit(BuildContext context) async {
    Uri uri = Uri.parse("http://localhost/pet-adoption-api/main.php");
    final Map<String, dynamic> userData = {
      "adopter_id": adopterId,
    };
    final Map<String, dynamic> data = {
      "operation": "getAdopterProfile",
      "json": jsonEncode(userData),
    };

    try {
      http.Response response = await http.post(uri, body: data);
      //   var result = jsonDecode(response.body);

      // try {
      // http.Response response = await http.post(
      //   uri,
      //   body: data,
      // );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      var result = jsonDecode(response.body);
      if (result["success"] != null) {
        _submitAdoptionRequest(context);
      } else {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                "You have to fill out and submit the form in the profile page to adopt."),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (error) {
      print(error);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("An error occurred: $error"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _submitAdoptionRequest(BuildContext context) async {
    Uri uri = Uri.parse("http://localhost/pet-adoption-api/main.php");
    final Map<String, dynamic> requestData = {
      "petId": pet['pet_id'].toString(),
      "adopterId": adopterId,
    };
    final Map<String, dynamic> data = {
      "operation": "adoptionRequest",
      "json": jsonEncode(requestData),
    };

    // try {
    //   http.Response response = await http.post(uri, body: data);
    //   var result = jsonDecode(response.body);

    try {
      http.Response response = await http.post(uri, body: data);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      var result = jsonDecode(response.body);

      if (response.statusCode == 200 && result["success"] != null) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Adoption request submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Submission failed: ${result["error"]}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (error) {
      // print(error);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("An error occurred: $error"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showProfileIncompleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0),
          ),
          title: Text('Incomplete Profile'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                  'You need to fill out and submit the form on the profile page to adopt.'),
              GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ProfilePage(adopterId: adopterId),
                    ),
                  );
                },
                child: Text(
                  'Profile',
                  style: TextStyle(
                    color: Colors.blue,
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
