import { Injectable, UploadedFile } from '@nestjs/common';
import { CreateFootageDto } from './dto/create-footage.dto';
import { UpdateFootageDto } from './dto/update-footage.dto';
import { GeminiService } from 'src/gemini/gemini.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileState } from "@google/generative-ai/server";

const maliciousEventFunctionDeclaration = {
  name: "DetectedEvent",
  parameters: {
    type: "OBJECT",
    description: "Set the brightness and color temperature of a room light.",
    properties: {
      id: {
        type: "STRING",
        description: "A Unique UUID Identifier identifying this particular event eg 1234-5678-9101",
      },
      severity: {
        type: "NUMBER",
        description: "The severity of the event and surely, eg 1-10 with 10 being the most severe",
      },
      confidence: {
        type: "NUMBER",
        description: "The degree of certainty, probability that the prediction of the suspected event happening, Are we 100% sure that this is event describe is happening? eg 1-10 with 10 being the most confident. ",
      },
      eventType: {
        type: "STRING",
        description: "The type of suspected event happending, eg robbery,etc.",
      },
      eventStartTime: {
        type: "STRING",
        description: "Time when the suspected event happens in the video",
      },
      eventEndTime: {
        type: "STRING",
        description: "Time when the suspected event ends in the video",
      },
      description: {
        type: "STRING",
        description: "Bried Description of the event happening",
      },
      suspect: {
        type: "ARRAY",
        description: "list of individual suspects that are involved in the detected malicious event",
        items: {

          confidence: {
            type: "NUMBER",
            description: "The degree of confidence of the suspected, eg 1-10 with 10 being the most confident",
          },
          appearance: {
            type: "STRING",
            description: "The description of the suspect how they appear in the video",
          },
          behavior: {
            type: "STRING",
            description: "The behavior of the suspect in the video",
          },
          associatedItems: {
            type: "STRING",
            description: "List of associated item with the suspect eg, knife, gun, etc",
          },
          description: {
            type: "STRING",
            description: "Description",
          },
        },
      },

    },
    required: ["severity", "confidence"],
  },
};
@Injectable()
export class FootageService {
  constructor(private readonly geminiService: GeminiService, private readonly prismaService: PrismaService) { }
  create(createFootageDto: CreateFootageDto) {
    return 'This action adds a new footage';
  }

  async findAll() {
    const footage = await this.prismaService.video.findMany({})
    const videos = await this.prismaService.video.count();
    const detectedEvents = await this.prismaService.detectedEvent.count();
    const suspects = await this.prismaService.suspect.count();
    return {
      footage,
      videos,
      detectedEvents,
      suspects
    }
  }
  async statistics() {
    const videos = await this.prismaService.video.count();
    const detectedEvents = await this.prismaService.detectedEvent.count();
    const suspects = await this.prismaService.suspect.count();
    return {
      videos,
      detectedEvents,
      suspects
    }
  }

  getFootage(id: string) {
    const footage = this.prismaService.video.findUnique({
      where: {
        id: id
      },
      include: {
        detectedEvents: {
          include: {
            suspects: true
          }
        }
      }
    })
    return footage;
  }

  update(id: string, updateFootageDto: UpdateFootageDto) {
    return this.prismaService.video.update({
      where: {
        id
      },
      data: updateFootageDto
    })
  }

  remove(id: string) {
    return this.prismaService.video.delete({
      where: {
        id
      }
    })
  }

  async uploadFile(files: Array<Express.Multer.File>) {
    const file = files[0];
    let uploadResponse = await this.geminiService.getFileManager().uploadFile(file.path, {
      displayName: file.originalname,
      mimeType: file.mimetype,
    });


    // let uploadResponse = {
    //   file: {

    //     "name": "files/zztd3gjq55j5",
    //     "displayName": "Untitled.jpg",
    //     "mimeType": "image/jpeg",
    //     "sizeBytes": "12061",
    //     "createTime": "2024-08-10T18:21:13.722169Z",
    //     "updateTime": "2024-08-10T18:21:13.722169Z",
    //     "expirationTime": "2024-08-12T18:21:13.702679004Z",
    //     "sha256Hash": "MDJkZWZkOTFiYWQ0OGU1MGI2NTBjOGIyZDFjMGVjMDUwZTZjZTBiZDU4ZmU2OTM3NDdhYTA2ZGM0Njg0ZGNkNQ==",
    //     "uri": "https://generativelanguage.googleapis.com/v1beta/files/zztd3gjq55j5",
    //     "state": "ACTIVE",
    //     videoMetadata: {
    //       videoDuration: "86s"
    //     }
    //   }
    // }
    const savedVideo = await this.prismaService.video.create({
      data: {
        uploadedBy: 'Harisu',
        videoPath: file.path,
        geminiName: uploadResponse.file.name,
        geminiDisplayName: uploadResponse.file.displayName,
        mimeType: uploadResponse.file.mimeType,
        geminiSizeBytes: parseInt(uploadResponse.file.sizeBytes),
        geminiCreateTime: uploadResponse.file.createTime,
        geminiUpdateTime: uploadResponse.file.updateTime,
        geminiExpirationTime: uploadResponse.file.expirationTime,
        geminiUri: uploadResponse.file.uri,
        geminiState: uploadResponse.file.state,
        geminiMeta: JSON.stringify(uploadResponse.file.videoMetadata)
      }
    })


    let getResponse = await this.geminiService.getFileManager().getFile(uploadResponse.file.name);

    while (getResponse.state === FileState.PROCESSING) {
      process.stdout.write(".")
      // Sleep for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10000));
      // Fetch the file from the API again
      getResponse = await this.geminiService.getFileManager().getFile(uploadResponse.file.name);

    }



    if (getResponse.state === FileState.FAILED) {
      await this.prismaService.video.update({
        where: {
          id: savedVideo.id
        },
        data: {
          geminiState: getResponse.state
        }
      })
      throw new Error("Video processing failed.");
    }


    // Get the previously uploaded file's metadata.
    getResponse = await this.geminiService.getFileManager().getFile(uploadResponse.file.name);
    console.log("getResponse", getResponse)

    // View the response.
    console.log(`Retrieved file ${getResponse.displayName} as ${getResponse.uri}`);
    const result = await this.geminiService.getGenAIForSecurity().generateContent([
      `You have been asked to provide information what you see in video attached.
      Return an empty array if there is no crime or suspicious activity detected.`,
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
    ]
    );
    console.log(result.response.text())
    const eventsArray = JSON.parse(result.response.text())
    if (Array.isArray(eventsArray)) {
      // loop through the fc and save it into event and suspect table

      eventsArray.forEach(async (element) => {
        const savedEvent = await this.prismaService.detectedEvent.create({
          data: {
            severity: element.severity,
            confidence: element.confidence,
            eventType: element.eventType,
            eventStartTime: element.eventStartTime,
            eventEndTime: element.eventEndTime,
            description: element.description,
            video: {
              connect: {
                id: savedVideo.id
              }
            },
            suspects: {
              createMany: {
                data:
                  element.suspect
              }
            }
          }
        })

      });

    }
    return eventsArray

  }

  async listFiles() {
    const listFilesResponse = await this.geminiService.getFileManager().listFiles();
    return listFilesResponse
  }
}
