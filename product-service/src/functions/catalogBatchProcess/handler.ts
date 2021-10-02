import 'source-map-support/register';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { SNS } from 'aws-sdk';
import productService from '../../resources/product.service';


const catalogBatchProcess = async (event: any) => {
  const sns = new SNS({});
  const data = event.Records.map(({ body }) => JSON.parse(body));

  for (let item of data) {
    await productService.create(item);
    sns.publish({
      Subject: 'Subject',
      Message: JSON.stringify(data),
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: `${item.price}`
        }
      },
      TopicArn: process.env.SNS_ARN
    }, () => {
      console.log('Message has been sent: ', JSON.stringify(data));
    })
  }

  return formatJSONResponse({ success: true });
};

export const main = middyfy(catalogBatchProcess);
