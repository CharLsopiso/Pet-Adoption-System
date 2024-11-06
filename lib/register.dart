import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _contactController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();

  bool _isLoading = false;

  void _register() {
    if (_firstNameController.text.isNotEmpty &&
        _lastNameController.text.isNotEmpty &&
        _emailController.text.isNotEmpty &&
        _contactController.text.isNotEmpty &&
        _addressController.text.isNotEmpty &&
        _usernameController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty) {
      setState(() {
        _isLoading = true;
      });
      register();
    } else {
      _showSnackBar('Please fill in all fields', Colors.red);
    }
  }

  void _showSnackBar(String message, Color backgroundColor) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        margin: EdgeInsets.all(16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo or Image (can be customized as needed)
                Container(
                  height: 100,
                  width: 100,
                  child: Image.asset('assets/LOGO_PET_2-removebg-preview.png'),
                ),
                SizedBox(height: 16),
                // Welcome Text
                Text(
                  'Join Our Pet Adoption Shelter',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 16),
                // First Name Input
                _buildInputField(
                    controller: _firstNameController, hintText: 'First Name'),
                SizedBox(height: 16),
                // Last Name Input
                _buildInputField(
                    controller: _lastNameController, hintText: 'Last Name'),
                SizedBox(height: 16),
                // Address Input
                _buildInputField(
                    controller: _addressController, hintText: 'Address'),
                SizedBox(height: 16),
                // Email Input
                _buildInputField(
                    controller: _emailController,
                    hintText: 'Email',
                    keyboardType: TextInputType.emailAddress),
                SizedBox(height: 16),
                // Contact Input
                _buildInputField(
                    controller: _contactController,
                    hintText: 'Contact Number',
                    keyboardType: TextInputType.phone),
                SizedBox(height: 16),
                // Username Input
                _buildInputField(
                    controller: _usernameController, hintText: 'Username'),
                SizedBox(height: 16),
                // Password Input
                _buildInputField(
                    controller: _passwordController,
                    hintText: 'Password',
                    obscureText: true),
                SizedBox(height: 16),
                // Register Button
                _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : ElevatedButton(
                        onPressed: _register,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF00D084),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          minimumSize: Size(double.infinity, 48),
                        ),
                        child: Text('Register', style: TextStyle(fontSize: 16)),
                      ),
                SizedBox(height: 16),
                // Already have an account? Login text
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Already have an account? "),
                    GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: Text(
                        'Login',
                        style: TextStyle(
                          color: Colors.orange,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          hintText: hintText,
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 16),
        ),
      ),
    );
  }

  void register() async {
    Uri uri = Uri.parse("http://localhost/pet-adoption-api/auth.php");

    final Map<String, dynamic> userData = {
      "firstName": _firstNameController.text,
      "lastName": _lastNameController.text,
      "email": _emailController.text,
      "contactNum": _contactController.text,
      "password": _passwordController.text,
      "address": _addressController.text,
      "username": _usernameController.text,
    };

    final Map<String, dynamic> data = {
      "operation": "adopterSignup",
      "json": jsonEncode(userData),
    };

    try {
      http.Response response = await http.post(
        uri,
        body: data,
      );

      if (response.statusCode == 200) {
        var result = jsonDecode(response.body);

        if (result["success"] != null) {
          _showSnackBar(result["success"], Colors.green);
          Future.delayed(Duration(seconds: 2), () {
            Navigator.pop(context);
          });
        } else if (result["error"] != null) {
          _showSnackBar('Registration failed: ${result["error"]}', Colors.red);
        }
      }
    } catch (error) {
      _showSnackBar('Error occurred: $error', Colors.red);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}
