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
    String result = await BlockfrostService().getAdaBalance("YOUR_CARDANO_ADDRESS_HERE");
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