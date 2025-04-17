<template>
    <div>
        <v-container fluid>
            <v-sheet elevation="1" class="pa-4">
                <v-row dense>
                    <v-col cols="4" sm="3" md="4">
                        <v-card class="ma-2" fill>
                            <v-card-title class="headline">Audit</v-card-title>
                            <v-card-text>Setup Auditing for your AWS Account so you can identify issues and find
                                remediations.</v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="primary">Setup Now</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="4" sm="3" md="4">
                        <v-card class="ma-2" fill>
                            <v-card-title class="headline">Identify</v-card-title>
                            <v-card-text>Identify issues in your AWS account such as over-privileged credentials.
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="primary" disabled> Add</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-container>
    </div>
</template>