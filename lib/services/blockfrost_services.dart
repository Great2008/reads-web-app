import 'dart:convert';
import 'package:http/http.dart' as http;

class BlockfrostService {
  final String apiKey = "previewNqgFSwQobHLnp76WHlG37BZiop6hFgW7"; // your key
  final String baseUrl = "https://cardano-preprod.blockfrost.io/api/v0"; // <-- changed

  Future<String> getAdaBalance(String address) async {
    final url = Uri.parse('$baseUrl/addresses/$address');
    final response = await http.get(url, headers: {'project_id': apiKey});
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final amounts = data['amount'] as List;
      final ada = amounts.firstWhere(
        (a) => a['unit'] == 'lovelace',
        orElse: () => {'quantity': '0'},
      );
      return (int.parse(ada['quantity']) / 1000000).toStringAsFixed(6) + " ADA";
    } else {
      return "Error fetching balance";
    }
  }
}