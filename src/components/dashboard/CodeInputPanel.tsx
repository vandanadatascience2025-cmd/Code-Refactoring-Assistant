import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

interface Props {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

const SAMPLE_CODE = `// Sample legacy code for analysis
function processOrders(orders, callback) {
  var results = [];
  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    if (order.status == "pending") {
      if (order.total > 100) {
        if (order.customer.type == "premium") {
          order.discount = order.total * 0.15;
        } else {
          order.discount = order.total * 0.05;
        }
      }
      order.tax = order.total * 0.08;
      order.finalTotal = order.total - order.discount + order.tax;
      results.push(order);
    }
  }
  callback(null, results);
}

function fetchCustomerData(id, cb) {
  db.query("SELECT * FROM customers WHERE id = " + id, function(err, rows) {
    if (err) { cb(err); return; }
    var customer = rows[0];
    db.query("SELECT * FROM orders WHERE customer_id = " + id, function(err2, orders) {
      if (err2) { cb(err2); return; }
      customer.orders = orders;
      cb(null, customer);
    });
  });
}`;

export function CodeInputPanel({ onAnalyze, isLoading }: Props) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="go">Go</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCode(SAMPLE_CODE)}
          className="text-xs"
        >
          Load Sample
        </Button>
      </div>
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here for technical debt analysis..."
        className="font-mono text-sm h-48 bg-card border-border resize-none"
      />
      <Button
        onClick={() => onAnalyze(code, language)}
        disabled={isLoading || !code.trim()}
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" /> Analyze Code
          </>
        )}
      </Button>
    </div>
  );
}
