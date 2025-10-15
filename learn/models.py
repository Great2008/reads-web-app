from django.db import models

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    reward_tokens = models.IntegerField(default=5)

    def __str__(self):
        return self.title