import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(ReadsApp());
}

class ReadsApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '\$READS MVP',
      theme: ThemeData(primarySwatch: Colors.green),
      home: HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}