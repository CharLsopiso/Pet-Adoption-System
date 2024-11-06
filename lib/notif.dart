import 'package:flutter/material.dart';

class NotificationPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Dummy notifications for illustration
    List<Map<String, String>> notifications = [
      {'title': 'New Pet Available', 'body': 'A new pet is available for adoption.'},
      {'title': 'Adoption Reminder', 'body': 'Your adoption form is pending.'},
      {'title': 'Pet Checkup Due', 'body': 'Time for a routine checkup for your adopted pet.'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.lightGreenAccent[100],
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: notifications.length,
          itemBuilder: (context, index) {
            return Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              elevation: 4,
              margin: EdgeInsets.symmetric(vertical: 8.0),
              child: ListTile(
                leading: Icon(Icons.notifications, color: Colors.blueAccent),
                title: Text(
                  notifications[index]['title']!,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                subtitle: Text(notifications[index]['body']!),
                trailing: Icon(Icons.arrow_forward_ios),
              ),
            );
          },
        ),
      ),
    );
  }
}
