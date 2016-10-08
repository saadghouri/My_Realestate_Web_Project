//File Header
//1  Record Type  			1  AN Y  “A” — fixed
//2  Company ID  			10 AN Y  Value to be provided by Caledon.
//3  File Creation Number 	6  N  Y  The file creation number must be incremented by one for each batch type. 
//4  File Creation Date		8  N  Y  Date  the  file  was  created,  in  YYYYMMDD format.
//5  File Type Indicator	4  AN Y  “PROD” or “TEST” Depending  on  whether  the  file  is  a  test  or production file.
//6  Version Indicator		4  AN Y  “0018” — fixed
//7  Batch Type  			3  A  Y  “PAD”: Pre-Authorized Debit batch “DBP”: Direct Banking Payment batch “IOP”: Interac Online Payment batch 
A,UNOINVTT,1,20150301,TEST,0018,PAD



//Batch Header
//1  Record Type  			1  AN Y  “X” — fixed
//2  Batch Number  			6  N  Y  Must  be  incremented  by  one  for  each  batch submitted within a file.
//3  Batch Payment Type 	1  AN Y  “D”: represents debit. No other types are currently available.
//4  Transaction Type Code 	3  N  Y  “431” — fixed value
//5  Merchant Terminal ID 	8  AN Y  Terminal ID provided by Caledon.
//6  Charge Description 	30 AN Y  Description  to  appear  on  client’s  statement.Typically a merchant’s business name.
//7  Bank ID  				3  N  Y  Merchant’s bank ID
//8  Branch Transit Number 	5  N  Y  Merchant’s transit number
//9  Account Number  		12 AN Y  Merchant’s bank account number
X,0,D,431,UNOINVTT,Dormbooker,001,00550,12345678
	

//Detail Debit Record
//1  Record Type  			1  AN Y  “D” — fixed
//2  Client ID  			29 AN Y  A unique value to represent the client/cardholder.
//3  Amount  				10 N  Y  Total transaction amount 10-digit field with 2 implied decimal places ($1.00 would be represented by “100”).  This field can not contain a decimal point or dollar sign.
//4  Bank ID  				3  N  Y  Client’s bank ID
//5  Branch Transit  Number 5  N  Y  Client’s transit number
//6  Account Number 		12 AN Y  Client’s bank account number 
//7	 Reference Number 		15 AN Y  Each  payment  must  have  a  unique  reference number per terminal ID. This unique value is used to represent the transaction/payment.
D,1,712,123,12345,12345678,REFNUM001122



//Batch Trailer Record
//1  Record Type 			1  AN Y  “Y” — fixed
//2  Batch Payment Type 	1  AN Y  “D” — fixed, represents debit.
//3  Batch Record Count 	8  N  Y  Total number of detail debit records in this batch.
//4  Batch Amount 			14 N  Y  Total value of the batch. 14-digit field with 2 implied decimal places ($1.00 would be represented by “100”).  This field cannot contain a decimal point or dollar sign.
Y,D,1,712


//File Trailer Record
//1  Record Type 				1  AN Y  “Z” — fixed
//2  File Trailer Count 		5  N  Y  Total  number  of  detail  debit  records  in  the file.
//3  File Trailer Net Amount 	14 N  Y  Total value of the entire file.14-digit  field  with  2  implied  decimal  places ($1.00 would be represented by  “100”).  This field cannot contain a decimal  point or dollar sign.
Z,1,712



A,UNOINVTT,1,20150301,TEST,0018,PAD
X,0,D,431,UNOINVTT,Dormbooker,001,00550,12345678
D,1,712,123,12345,12345678,REFNUM001122
Y,D,1,712
Z,1,712







A,COMPANY1,1,20120125,TEST,0010,PAD  					//File Header (A)
X,001,D,431,TESTTEST,ABC MERCHANT,001,00550,12345678	//Batch Header for Merchant 1 (X)
D,CLIENT001,100000,123,12345,12345678,REFNUM001122 		//Detail Debit Record (D)
D,CLIENT002,10000,123,12345,2345789,REFNUM002222		//Detail Debit Record (D)
Y,D,2,110000											//Batch Trailer for Merchant 1 (Y)
X,D,431,TESTSA02,XYZ MERCHANT,012,0551,12345679			//Batch Header for Merchant 2 (X)
D,CLIENT112,10000,123,12345,23456789,REPAIRFEE			//Detail Debit Record (D)
Y,D,1,10000 											//Batch Trailer for Merchant 2 (Y)
Z,3,120000 												//File Trailer (Z)





A,UNOINVTT,1,20150301,TEST,0018,PAD


X,0,D,431,UNOINVTT,Dormbooker,asd,asdasd,asdasd
D,1,712,Zx,asd,asd,1_
Y,D,1,712
Z,1,712





A,UNOINVESTTEST,0006,20150301,TEST,0018,PAD
X,1,D,431,UNOINVTT,Dormbooker,001,00002,123456
D,1,712,123,12345,12345678,REFNUM001122
Y,D,1,712
Z,1,712




acknowledgment report
1  Record Type  3  AN  Y  Record Type: “FHD”
2  Company ID  10  AN  Y  From the incoming batch’s file header.
3  File Creation Number 4  N  Y  From the incoming batch’s file header.
4  File Creation Date 8  N  Y  From the incoming batch’s file header.
5  Batch Header Record Count 12  N  Y  Total number of batches received.
6  Detail Record Count 12  N  Y  Total number of payments received.
7  Total File Amount 14  N  Y  Total value of the file received.
8  File Status Code  4  N  Y  File Acknowledgement Status Codes:
	“0000”: Accepted
	“0001”: File out of balance
	“0002”: Batch level reject
	“0003”: Transaction reject
	“0004”: Batch and transaction reject
	“0005”: Detail Record Count out of balance
	“0006”: Invalid File Format
	“0007”: Invalid File Header
	NOTE: Status Codes 0001, 0005, 0006 and 
	0007 will cause the entire file to be rejected.
9  Reject Reason  60  AN  Y  Details of the rejection reason. 

FHD	UNOINVESTTEST	6	20150301	1	1	712	0




reply

1  Record Type  4  AN  “SUMM” — fixed value
2  Payment Date  10  AN  YYYYMMDD
3  Terminal ID  8  AN  Value from the incoming batch’s Header Record.
4  Gross Payment Amount 14  AN  Total  value  from  the  incoming  batch’s  Trailer Records.
5  Gross payment Count 5  N  Total  value  from  the  incoming  batch’s  Trailer Records.
6  Gross payment Fee 12  N  Total amount of fees deducted.
7  Reject Item Amount 12  N  Total rejected item amount.
8  Reject Item Count 5  N  Total count of rejected items.
9  Reject Item Fee  12  N  Total amount of fees deducted for rejecting items.
10  Return Item Amount
12  N  Total returned item amount.
11  Return Item Count 5  N  Total count of returned items.
12  Return Item Fee  12  N  Total amount of fees for returned items.
13  Net Amount  14  N  The net amount per terminal ID. Negative amounts will have a leading minus sign.
14  Adjustments  14  N  The adjustment to the merchant balance. Negative amounts will have a leading minus sign. 
15  Previous Balance  14  N  The merchant’s previous balance. Negative amounts will have a leading minus sign. 
16  Current Balance  14  N  The merchant’s current balance. 
	This is the previous balance plus adjustments plus 
	current days net amount. 
	Negative amounts will have a leading minus sign.
17  Funds Released  14  N  The  credit  amount  transferred  to  the  merchant’s bank account.
	If merchant balance is negative or the merchant’s 
	status is “on hold”,  then the funds released will be 
	zero. 
18  Payment Status  8  AN  Status of payment. Values are “PAID” or “HOLD”.


1.	SUMM,
2.	2015-03-03,
3.	UNOINVTT,
4.	712,
5.	1,
6.	0,
7.	0,
8.	0,
9.	0,
10.	0,
11.	0,
12.	0,
13.	712,
14.	0,
15.	0,
16.	712,
17.	712,
18.	PAID


1  Record Type  4  AN  “TDTL” — fixed value
2  Payment Date  10  AN  YYYYMMDD
3  Terminal ID  8  AN  Value from the Summary Record.
4  Client ID  10  AN  Value  from  the  incoming  batch’s  Detail  Debit Record.
5  Reference Number 15  AN  Value  from  the  incoming  batch’s  Detail  Debit Record.
6  Amount  12  N  Value  from  the  incoming  batch’s  Detail  Debit Record.
7  Status  10  AN  Status of payment. Possible  values  are  “PROCESSED”,  “RETURNED”, “REJECTED”, or “DUPLICATE”.
8  Reason Code  4  N  If the payment has been rejected or returned , then this  field  will  contain  the  reason  code  of  the returned or rejected item from the bank.
9  Reason Text  256  AN  If payment has been  rejected or returned then this field  will  contain  the  description  of  the  reject  or returned item from the bank. 
10  Reject/Return Item Fee
12  N  This  field  will  contain  the  fee  for  the  reject  or returned item.

TDTL,2015-03-03,UNOINVTT,1,REFNUM001122,712,PROCESSED,,,


SUMM,2015-03-03,UNOINVTT,712,1,0,0,0,0,0,0,0,712,0,0,712,712,PAID
TDTL,2015-03-03,UNOINVTT,1,REFNUM001122,712,PROCESSED,,,
