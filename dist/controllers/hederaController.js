"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import Hedera SDK
var sdk_1 = require("@hashgraph/sdk");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Load Hedera Credentials
var operatorId = sdk_1.AccountId.fromString(process.env.OPERATOR_ID);
var operatorKey = sdk_1.PrivateKey.fromString(process.env.OPERATOR_KEY);
var client = sdk_1.Client.forTestnet().setOperator(operatorId, operatorKey);
// 1️⃣ Create Compliance Logging on Hedera Consensus Service (HCS)
function createComplianceTopic() {
    return __awaiter(this, void 0, void 0, function () {
        var transaction, txResponse, receipt, topicId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transaction = new sdk_1.TopicCreateTransaction();
                    return [4 /*yield*/, transaction.execute(client)];
                case 1:
                    txResponse = _a.sent();
                    return [4 /*yield*/, txResponse.getReceipt(client)];
                case 2:
                    receipt = _a.sent();
                    topicId = receipt.topicId;
                    console.log("\u2705 Compliance Topic Created: ".concat(topicId));
                    return [2 /*return*/, topicId];
            }
        });
    });
}
// 2️⃣ Create Trust Token on Hedera Token Service (HTS)
function createTrustToken() {
    return __awaiter(this, void 0, void 0, function () {
        var transaction, txResponse, receipt, tokenId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transaction = new sdk_1.TokenCreateTransaction()
                        .setTokenName("TrustToken")
                        .setTokenSymbol("TRUST")
                        .setDecimals(0)
                        .setInitialSupply(1000000)
                        .setTreasuryAccountId(operatorId)
                        .freezeWith(client)
                        .sign(operatorKey);
                    return [4 /*yield*/, transaction.execute(client)];
                case 1:
                    txResponse = _a.sent();
                    return [4 /*yield*/, txResponse.getReceipt(client)];
                case 2:
                    receipt = _a.sent();
                    tokenId = receipt.tokenId;
                    console.log("\u2705 Trust Token Created: ".concat(tokenId));
                    return [2 /*return*/, tokenId];
            }
        });
    });
}
// 3️⃣ Supplier Verification: Assign Trust Tokens for Compliance
function rewardSupplier(supplierId, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        var transaction, txResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transaction = new sdk_1.TransferTransaction()
                        .addTokenTransfer(tokenId, operatorId, -100)
                        .addTokenTransfer(tokenId, supplierId, 100)
                        .freezeWith(client)
                        .sign(operatorKey);
                    return [4 /*yield*/, transaction.execute(client)];
                case 1:
                    txResponse = _a.sent();
                    return [4 /*yield*/, txResponse.getReceipt(client)];
                case 2:
                    _a.sent();
                    console.log("\u2705 Supplier ".concat(supplierId, " rewarded with 100 TRUST tokens"));
                    return [2 /*return*/];
            }
        });
    });
}
// 4️⃣ Smart Contract for Penalty Enforcement
function deployPenaltyContract() {
    return __awaiter(this, void 0, void 0, function () {
        var contractBytecode, transaction, receipt, contractId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contractBytecode = "0x...";
                    transaction = new sdk_1.ContractCreateFlow()
                        .setBytecode(contractBytecode)
                        .setGas(100000)
                        .execute(client);
                    return [4 /*yield*/, transaction];
                case 1: return [4 /*yield*/, (_a.sent()).getReceipt(client)];
                case 2:
                    receipt = _a.sent();
                    contractId = receipt.contractId;
                    console.log("\u2705 Penalty Contract Deployed: ".concat(contractId));
                    return [2 /*return*/, contractId];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var topicId, tokenId, contractId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createComplianceTopic()];
            case 1:
                topicId = _a.sent();
                return [4 /*yield*/, createTrustToken()];
            case 2:
                tokenId = _a.sent();
                return [4 /*yield*/, deployPenaltyContract()];
            case 3:
                contractId = _a.sent();
                console.log("🚀 Hedera Blockchain Prototype Ready!");
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=hederaController.js.map