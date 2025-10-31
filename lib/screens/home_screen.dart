import 'package:flutter/material.dart';
import '../services/blockfrost_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String balance = "Loading...";

  @override
  void initState() {
    super.initState();
    _getBalance();
  }

  Future<void> _getBalance() async {
    String result = await BlockfrostService().getAdaBalance("addr_test1qp3egmn0a7p75f29hsjgxwzed8dcav5ua8fjcet07jllmvxs8p2fqjn49skw6mss2jjkqjn7ca7402z3n3xuq8wedvcsq2quhy");
    setState(() => balance = result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("\$READS MVP")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("ADA Balance", style: TextStyle(fontSize: 24)),
            const SizedBox(height: 20),
            Text(balance, style: const TextStyle(fontSize: 20, color: Colors.green)),
          ],
        ),
      ),
    );
  }
}