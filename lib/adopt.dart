import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AdoptPage extends StatefulWidget {
  @override
  _AdoptPageState createState() => _AdoptPageState();
}

class _AdoptPageState extends State<AdoptPage> {
  List<dynamic> _timelineSteps = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchTimelineSteps();
  }

  Future<void> fetchTimelineSteps() async {
    String url = "http://localhost/pet-adoption-api/main.php";

    final Map<String, dynamic> queryParams = {
      "operation": "getTimeline", // Updated to timeline for parcel steps
      "json": "",
    };

    try {
      http.Response response =
          await http.get(Uri.parse(url).replace(queryParameters: queryParams));

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);

        if (jsonResponse.containsKey('success')) {
          setState(() {
            _timelineSteps = jsonResponse['success'];
            _isLoading = false; // Data loaded successfully
          });
        } else if (jsonResponse.containsKey('error')) {
          setState(() {
            _timelineSteps = []; // Empty list if no timeline steps found
            _isLoading = false;
          });
          print(jsonResponse['error']);
        }
      } else {
        print('Failed to load timeline, status code: ${response.statusCode}');
        setState(() {
          _isLoading = false; // Data load failed
        });
      }
    } catch (error) {
      print('An error occurred: $error');
      setState(() {
        _isLoading = false; // Error occurred
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Delivery Timeline"),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.popUntil(context, (route) => route.isFirst);
          },
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _timelineSteps.isEmpty
                    ? Center(child: Text("No timeline steps found."))
                    : ListView.builder(
                        padding: const EdgeInsets.all(8.0),
                        itemCount: _timelineSteps.length,
                        itemBuilder: (context, index) {
                          return TimelineEntry(
                            step: _timelineSteps[index],
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class TimelineEntry extends StatelessWidget {
  final dynamic step;

  TimelineEntry({
    required this.step,
  });

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Timeline Indicator
        Column(
          children: [
            Container(
              width: 12.0,
              height: 12.0,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.green,
              ),
            ),
            Container(
              width: 2.0,
              height: 60.0,
              color: Colors.grey,
            ),
          ],
        ),
        SizedBox(width: 8.0),
        // Timeline Content
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                step['location'] ?? 'Unknown Location',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: screenWidth * 0.04,
                ),
              ),
              SizedBox(height: 4.0),
              Text(
                step['status'] ?? 'Unknown Status',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: screenWidth * 0.035,
                ),
              ),
              SizedBox(height: 4.0),
              Text(
                step['date_time'] ?? 'Unknown Date/Time',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: screenWidth * 0.03,
                ),
              ),
              SizedBox(height: 12.0),
            ],
          ),
        ),
      ],
    );
  }
}
