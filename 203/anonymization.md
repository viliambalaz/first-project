# Model: `chcemvediet.apps.anonymization`

![](assets/anonymization.svg)

## `AttachmentNormalization`

Represents a single local file, which was created by normalization of Attachment file.

Relations:
* `attachment`: Attachment; May NOT be NULL.\
  The Attachment from which AttachmentNormalization was created.


Properties:
* `successful`: Boolean; May NOT be NULL.
* `file`: File; May NOT be NULL.\
  Empty filename if normalization failed or normalization didn’t create any file.
* `name`: String; May be empty.\
  Automatically computed when creating a new object. Empty, if file.name is empty.
* `content_type`: String; May be NULL.
* `created`: Datetime; May NOT be NULL.
* `size`: Number; May be NULL.
* `debug`: String; May NOT be NULL; May be empty.

Computed Properties:
* `content`: String; May be NULL; May be empty; Read-only.


<sub>*\* Features that are marked ~~strikethrough~~ are not implemented yet.*</sub>

